import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import Tenant from "@/lib/tenant/tenant";
import { rgbStringToHex } from "@/lib/color";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { ProposalInfo } from "@/lib/contracts/types/voting";
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

const BubbleNode = memo(
  ({ node, transform }: { node: BubbleNode; transform: d3.ZoomTransform }) => {
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

    const fontSize = Math.min(node.r / 3.5, (node.r * 2) / 10);

    return (
      <g
        transform={`translate(${node.x},${node.y})`}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/delegates/${node.address}`);
        }}
        style={{ cursor: "pointer" }}
      >
        <circle
          r={node.r}
          style={{
            fill: fillColor,
            transition: "fill 0.15s ease-out",
          }}
        />
        <foreignObject
          x={-node.r}
          y={-node.r}
          width={node.r * 2}
          height={node.r * 2}
          style={{
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            className="flex items-center justify-center w-full h-full text-white"
            style={{
              fontSize: `${fontSize}px`,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <span className="truncate max-w-[120px]" title={node.address}>
              {node.address}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  }
);

BubbleNode.displayName = "BubbleNode";

export default function BubbleChart({
  proposal,
  votes,
}: {
  proposal: ProposalInfo;
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

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    try {
      setHasMoreVotes(votes.length > CHART_DIMENSIONS.maxVotes);

      if (votes.length === 0) {
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

      const packedData = packedDataRaw.filter((d) => {
        // Filter out any nodes with invalid coordinates
        const isValid =
          Number.isFinite(d.x) &&
          Number.isFinite(d.y) &&
          Number.isFinite(d.r) &&
          d.r > 0;
        if (!isValid) {
          console.log(
            "[BubbleChart] Filtering out invalid node:",
            d.address,
            { x: d.x, y: d.y, r: d.r }
          );
        }
        return isValid;
      });

      console.log(
        "[BubbleChart] packedData after filter:",
        packedData.length,
        "nodes"
      );

      // Early return if no valid packed data
      if (packedData.length === 0) {
        console.warn(
          "[BubbleChart] No valid packed data after d3.pack and filter"
        );
        setNodes([]);
        setTransform(d3.zoomIdentity.translate(0, 0).scale(1));
        return;
      }

      const bounds = {
        minX: d3.min(packedData, (d) => (d.x ?? 0) - (d.r ?? 0)) || 0,
        maxX:
          d3.max(packedData, (d) => (d.x ?? 0) + (d.r ?? 0)) ||
          CHART_DIMENSIONS.width,
        minY: d3.min(packedData, (d) => (d.y ?? 0) - (d.r ?? 0)) || 0,
        maxY:
          d3.max(packedData, (d) => (d.y ?? 0) + (d.r ?? 0)) ||
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
      setNodes(packedData);

      const zoom = d3
        .zoom<SVGSVGElement, undefined>()
        .scaleExtent([ZOOM_CONFIG.min, ZOOM_CONFIG.max])
        .on("zoom", (event) => setTransform(event.transform));

      d3.select<SVGSVGElement, undefined>(svg)
        .call(zoom as any)
        .call((selection) => zoom.transform(selection, defaultTransform));

      return () => {
        zoom.on("zoom", null);
      };
    } catch (error) {
      console.error("[BubbleChart] Error rendering bubble chart:", error);
      // Reset to safe state on error
      setNodes([]);
      setTransform(d3.zoomIdentity.translate(0, 0).scale(1));
    }
  }, [votes, createZoom]);

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
                <BubbleNode
                  key={node.address}
                  node={node}
                  transform={transform}
                />
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
