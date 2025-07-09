"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AlignJustify, LayoutGrid } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition, type ReactNode } from "react";
import DelegatesSortFilter from "@/components/Delegates/DelegatesFilter/DelegatesSortFilter";
import DelegatesSearch from "@/components/Delegates/DelegatesSearch/DelegatesSearch";
import { DelegatesFilter } from "../DelegatesFilter/DelegatesFilter";

export default function DelegateTabs({
  children,
  startTransitionFilter,
  startTransitionSort,
}: {
  children: ReactNode;
  startTransitionFilter: (callback: () => void) => void;
  startTransitionSort: (callback: () => void) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "delegates",
    shallow: false,
    startTransition,
  });
  const [layout, setLayout] = useQueryState("layout", {
    defaultValue: "grid",
    shallow: true,
  });

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  return (
    <Tabs
      className="max-w-full"
      value={tab}
      onValueChange={(value) => handleTabChange(value)}
    >
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
        <TabsList>
          <TabsTrigger className="text-2xl" value="delegates">
            Delegates
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-col sm:flex-row justify-between gap-3 w-full sm:w-fit">
          <DelegatesSearch />
          <DelegatesSortFilter startTransitionSort={startTransitionSort} />
          <DelegatesFilter startTransitionFilter={startTransitionFilter} />
          <div className="flex items-center gap-2 bg-wash rounded-full px-4 py-2 shrink-0">
            <button
              onClick={() => {
                setLayout("grid");
              }}
              disabled={layout === "grid"}
            >
              <LayoutGrid
                className={`h-6 w-6 ${layout === "grid" ? "text-secondary" : "text-secondary/30"}`}
              />
            </button>
            <button
              onClick={() => {
                setLayout("list");
              }}
              disabled={layout === "list"}
            >
              <AlignJustify
                className={`h-6 w-6 ${layout === "list" ? "text-primary" : "text-secondary/30"}`}
              />
            </button>
          </div>
        </div>
      </div>
      <div className={cn(isPending && "animate-pulse")}>{children}</div>
    </Tabs>
  );
}
