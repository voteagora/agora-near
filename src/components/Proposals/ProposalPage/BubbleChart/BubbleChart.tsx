import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import Tenant from "@/lib/tenant/tenant";
import { rgbStringToHex } from "@/lib/color";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { ProposalVotingHistoryRecord } from "@/lib/api/proposal/types";

//Bubble contransts
const CHART_DIMENSIONS = {
  width: 720,
  height: 250,
  padding: 3,
  maxVotes: 50,
} as const;

const BUBBLE_PADDING = 10;

const ZOOM_CONFIG = {
  min: 0.5,
  max: 100,
  step: 3,
} as const;

interface BubbleNode extends d3.SimulationNodeDatum {
  address: string;
  support: "0" | "1" | "2";
  value: number;
  r: number;
}

// Controls visual scaling of bubble sizes relative to voting power ratio
const SCALING_EXPONENT = 0.4;
const transformVotesToBubbleData = (
  votes: ProposalVotingHistoryRecord[]
): BubbleNode[] => {
  const sortedVotes = votes.slice().slice(0, CHART_DIMENSIONS.maxVotes);

  // Sanitize weights: coerce to number, ensure finite and non-negative
  const rawWeights = sortedVotes.map((v) => {
    const n = Number((v as any)?.votingPower);
    if (!Number.isFinite(n) || n < 0) return 0;
    return n;
  });

  const maxWeight = Math.max(0, ...rawWeights);
  // If all weights are zero, fallback to uniform weights to avoid degenerate radii
  const effectiveWeights = maxWeight > 0 ? rawWeights : rawWeights.map(() => 1);

  return sortedVotes.map((vote, i) => {
    const value = effectiveWeights[i] ?? 0;
    // Avoid division by zero by falling back to 1 when maxWeight is 0
    const denom = maxWeight > 0 ? maxWeight : 1;
    const ratio = value / denom;
    const radius = Math.pow(ratio, SCALING_EXPONENT) * 40;
    return {
      address: vote.accountId,
      support:
        vote.voteOption === "0" ? "1" : vote.voteOption === "1" ? "0" : "2",
      value,
      // Ensure finite, positive radius to prevent rendering/zoom issues
      r: Number.isFinite(radius) && radius > 0 ? radius : 1,
    };
  });
};

const ZoomButton = memo(
  ({
    onClick,
    icon: Icon,
    label,
  }: {
    onClick: () => void;
    icon: typeof Plus | typeof Minus | typeof RotateCcw;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className="p-1 bg-neutral hover:bg-wash rounded-md border border-line"
      aria-label={label}
    >
      <Icon size={16} />
    </button>
  )
);

ZoomButton.displayName = "ZoomButton";

const BubbleNode = memo(({ node }: { node: BubbleNode }) => {
  const router = useRouter();
  const { ui } = Tenant.current();

  const fillColor = useMemo(() => {
    const colorMap = {
      "1": ui.customization?.positive,
      "0": ui.customization?.negative,
      "2": ui.customization?.tertiary,
    };
    return rgbStringToHex(colorMap[node.support]);
  }, [node.support, ui.customization]);

  // Contrast-aware text color
  const textColor = useMemo(() => {
    const hex = (fillColor || "#000000").replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 0.6 ? "#000000" : "#FFFFFF";
  }, [fillColor]);

  const baseFontSize = useMemo(() => {
    const scaled = node.r / 3.5;
    return Math.max(8, Math.min(scaled, 16));
  }, [node.r]);

  const textRef = useRef<SVGTextElement>(null);
  const [fittedFontSize, setFittedFontSize] = useState<number>(baseFontSize);

  // Fit text without stretching: iteratively shrink until it fits target width
  useEffect(() => {
    setFittedFontSize(baseFontSize);
    const el = textRef.current;
    if (!el) return;

    const maxWidth = node.r * 1.6; // ~80% of diameter
    let attempts = 0;

    const adjust = () => {
      if (!el || attempts > 6) return;
      const width = el.getComputedTextLength();
      if (Number.isFinite(width) && width > 0 && width > maxWidth) {
        setFittedFontSize((prev) => {
          const ratio = maxWidth / width;
          const next = Math.max(6, Math.floor(prev * ratio * 0.96));
          return next < prev ? next : prev;
        });
        attempts += 1;
        requestAnimationFrame(adjust);
      }
    };

    requestAnimationFrame(adjust);
  }, [baseFontSize, node.address, node.r]);

  const clipId = useMemo(
    () => `clip-${node.address.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    [node.address]
  );

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/delegates/${node.address}`);
      }}
      style={{ cursor: "pointer" }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle r={node.r} />
        </clipPath>
      </defs>

      <circle
        r={node.r}
        style={{ fill: fillColor, transition: "fill 0.15s ease-out" }}
      />

      <g clipPath={`url(#${clipId})`}>
        <text
          ref={textRef}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          style={{
            fontSize: `${fittedFontSize}px`,
            fontWeight: 600,
            userSelect: "none",
            pointerEvents: "none",
            paintOrder: "stroke",
            stroke:
              textColor === "#FFFFFF"
                ? "rgba(0,0,0,0.5)"
                : "rgba(255,255,255,0.55)",
            strokeWidth: 1,
          }}
        >
          {node.address}
        </text>
      </g>
    </g>
  );
});

BubbleNode.displayName = "BubbleNode";

export default function BubbleChart({
  votes,
}: {
  votes: ProposalVotingHistoryRecord[];
}) {
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const [transform, setTransform] = useState(() =>
    d3.zoomIdentity.translate(0, 0).scale(1)
  );

  const [hasMoreVotes, setHasMoreVotes] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultTransformRef = useRef<d3.ZoomTransform | null>(null);

  const createZoom = useMemo(
    () =>
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([ZOOM_CONFIG.min, ZOOM_CONFIG.max])
        .on("zoom", (event) => setTransform(event.transform)),
    []
  );

  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_CONFIG.min, ZOOM_CONFIG.max])
      .on("zoom", (event) => setTransform(event.transform));

    d3.select<SVGSVGElement, unknown>(svgRef.current)
      .transition()
      .duration(300)
      .call((t) => zoom.scaleTo(t as any, transform.k + factor));
  };

  const handleReset = () => {
    if (!svgRef.current || !defaultTransformRef.current) return;
    d3.select<SVGSVGElement, unknown>(svgRef.current)
      .transition()
      .duration(300)
      .call(createZoom.transform, defaultTransformRef.current);
  };

  // Effect 1: Process votes into nodes (doesn't need SVG ref)
  useEffect(() => {
    console.log("[BubbleChart] Processing votes, count:", votes.length);

    try {
      setHasMoreVotes(votes.length > CHART_DIMENSIONS.maxVotes);

      if (votes.length === 0) {
        console.warn("[BubbleChart] No votes, setting empty state");
        setNodes([]);
        setTransform(d3.zoomIdentity.translate(0, 0).scale(1));
        return;
      }

      const bubbleData = transformVotesToBubbleData(votes);
      console.log(
        "[BubbleChart] bubbleData generated:",
        bubbleData.length,
        "nodes from",
        votes.length,
        "votes"
      );
      console.log(
        "[BubbleChart] Initial bubble radii:",
        bubbleData.map((b) => ({ address: b.address, r: b.r }))
      );

      // Early return if no valid bubble data
      if (!bubbleData || bubbleData.length === 0) {
        console.warn("[BubbleChart] No valid bubble data generated from votes");
        setNodes([]);
        setTransform(d3.zoomIdentity.translate(0, 0).scale(1));
        return;
      }

      const pack = d3
        .pack<BubbleNode>()
        .size([CHART_DIMENSIONS.width - 20, CHART_DIMENSIONS.height - 20])
        .padding(BUBBLE_PADDING);

      const root = d3
        .hierarchy<BubbleNode>({ children: bubbleData } as any)
        .sum((d) => d.value ?? 0);

      const packedDataRaw = pack(root)
        .leaves()
        .map((d) => ({
          ...d.data,
          x: d.x,
          y: d.y,
          r: d.r,
        })) as BubbleNode[];

      console.log(
        "[BubbleChart] packedDataRaw:",
        packedDataRaw.length,
        "nodes",
        packedDataRaw.slice(0, 3)
      );
      console.log(
        "[BubbleChart] After d3.pack radii:",
        packedDataRaw.map((b) => ({ address: b.address, r: b.r }))
      );

      const packedData = packedDataRaw.filter((d) => {
        // Filter out only truly invalid nodes (NaN/Infinity)
        // Accept very small radii (> 0.01) as d3.pack may generate these legitimately
        const isValid =
          Number.isFinite(d.x) &&
          Number.isFinite(d.y) &&
          Number.isFinite(d.r) &&
          d.r >= 0.01;
        if (!isValid) {
          console.log("[BubbleChart] Filtering out invalid node:", d.address, {
            x: d.x,
            y: d.y,
            r: d.r,
          });
        }
        return isValid;
      });

      console.log(
        "[BubbleChart] packedData after filter:",
        packedData.length,
        "nodes"
      );

      // If filtering removed all nodes, try with less strict validation
      let finalPackedData = packedData;
      if (packedData.length === 0 && packedDataRaw.length > 0) {
        console.warn(
          "[BubbleChart] Filter removed all nodes, using raw data with basic validation"
        );
        finalPackedData = packedDataRaw.map((d) => ({
          ...d,
          // Ensure minimum viable coordinates
          x: Number.isFinite(d.x) ? d.x : CHART_DIMENSIONS.width / 2,
          y: Number.isFinite(d.y) ? d.y : CHART_DIMENSIONS.height / 2,
          r: Number.isFinite(d.r) && d.r > 0 ? d.r : 5,
        }));
        console.log(
          "[BubbleChart] Using fallback data:",
          finalPackedData.length,
          "nodes"
        );
      }

      // Early return if truly no data
      if (finalPackedData.length === 0) {
        console.warn("[BubbleChart] No nodes available after all attempts");
        setNodes([]);
        setTransform(d3.zoomIdentity.translate(0, 0).scale(1));
        return;
      }

      const bounds = {
        minX: d3.min(finalPackedData, (d) => (d.x ?? 0) - (d.r ?? 0)) || 0,
        maxX:
          d3.max(finalPackedData, (d) => (d.x ?? 0) + (d.r ?? 0)) ||
          CHART_DIMENSIONS.width,
        minY: d3.min(finalPackedData, (d) => (d.y ?? 0) - (d.r ?? 0)) || 0,
        maxY:
          d3.max(finalPackedData, (d) => (d.y ?? 0) + (d.r ?? 0)) ||
          CHART_DIMENSIONS.height,
      };

      const dx = bounds.maxX - bounds.minX;
      const dy = bounds.maxY - bounds.minY;
      // Compute a safe denominator for initial fit-to-bounds scaling
      const denom =
        Math.max(dx / CHART_DIMENSIONS.width, dy / CHART_DIMENSIONS.height) ||
        1;
      let scale = 1.5 / denom;
      // Guard against NaN/Infinity/zero scale — fallback to neutral scale
      if (!Number.isFinite(scale) || scale <= 0) {
        scale = 1;
      }
      const translateX =
        (CHART_DIMENSIONS.width - scale * (bounds.minX + bounds.maxX)) / 2;
      const translateY =
        (CHART_DIMENSIONS.height - scale * (bounds.minY + bounds.maxY)) / 2;

      const defaultTransform = d3.zoomIdentity
        // Ensure finite translations to prevent the SVG from jumping to invalid positions
        .translate(
          Number.isFinite(translateX) ? translateX : 0,
          Number.isFinite(translateY) ? translateY : 0
        )
        .scale(scale);
      defaultTransformRef.current = defaultTransform;
      setTransform(defaultTransform);
      setNodes(finalPackedData);

      console.log(
        "[BubbleChart] Successfully processed data, nodes:",
        finalPackedData.length
      );
    } catch (error) {
      console.error("[BubbleChart] Error processing votes:", error);
      console.error(
        "[BubbleChart] Error stack:",
        error instanceof Error ? error.stack : error
      );
      // Reset to safe state on error
      setNodes([]);
      setTransform(d3.zoomIdentity.translate(0, 0).scale(1));
    }
  }, [votes]);

  // Effect 2: Setup zoom behavior (needs SVG ref and nodes)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      console.log("[BubbleChart] Zoom effect: No SVG ref yet");
      return;
    }

    if (nodes.length === 0) {
      console.log("[BubbleChart] Zoom effect: No nodes yet");
      return;
    }

    console.log(
      "[BubbleChart] Setting up zoom behavior for",
      nodes.length,
      "nodes"
    );

    const zoom = d3
      .zoom<SVGSVGElement, undefined>()
      .scaleExtent([ZOOM_CONFIG.min, ZOOM_CONFIG.max])
      .on("zoom", (event) => setTransform(event.transform));

    d3.select<SVGSVGElement, undefined>(svg)
      .call(zoom as any)
      .call((selection) =>
        zoom.transform(
          selection,
          defaultTransformRef.current || d3.zoomIdentity
        )
      );

    return () => {
      zoom.on("zoom", null);
    };
  }, [nodes, createZoom]);

  console.log(
    "[BubbleChart] Render - nodes.length:",
    nodes.length,
    "votes.length:",
    votes.length
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative h-[230px]">
        {nodes.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            <ZoomButton
              onClick={() => handleZoom(ZOOM_CONFIG.step)}
              icon={Plus}
              label="Zoom in"
            />
            <ZoomButton
              onClick={() => handleZoom(-ZOOM_CONFIG.step)}
              icon={Minus}
              label="Zoom out"
            />
            <ZoomButton
              onClick={handleReset}
              icon={RotateCcw}
              label="Reset zoom"
            />
          </div>
        )}

        {nodes.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-secondary text-sm">
            No voting data available to display
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CHART_DIMENSIONS.width} ${CHART_DIMENSIONS.height}`}
            style={{ width: "100%", height: "100%" }}
          >
            <g
              transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
            >
              {nodes.map((node) => (
                <BubbleNode key={node.address} node={node} />
              ))}
            </g>
          </svg>
        )}
      </div>
      {hasMoreVotes && (
        <div className="mt-2 text-center text-xs text-gray-500">
          Highlighting the most impactful votes
        </div>
      )}
    </div>
  );
}
