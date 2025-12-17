"use client";

import { useState, useMemo } from "react";
import ResourceCard from "@/components/ResourceCard";
import type { Resource, Category, SupportNeed, SensoryLoad, SetupEffort, PriceType } from "@/types/resource";
import { SUPPORT_NEED_LABELS, CATEGORY_LABELS } from "@/types/resource";

let resources: Resource[] = [];
let dataExists = true;

try {
  const data = require("@/data/resources");
  resources = data.resources || [];
} catch {
  dataExists = false;
}

const FEELING_GROUPS: Record<string, { emoji: string; label: string; needs: SupportNeed[] }> = {
  overwhelmed: {
    emoji: "🌀",
    label: "overwhelmed",
    needs: ["overwhelm", "sensory_sensitivity", "low_energy"],
  },
  timeblind: {
    emoji: "⏰",
    label: "time-blind",
    needs: ["time_blindness", "transitioning"],
  },
  stuck: {
    emoji: "🪨",
    label: "stuck starting",
    needs: ["task_initiation", "prioritization"],
  },
  scattered: {
    emoji: "🫧",
    label: "scattered",
    needs: ["focus", "distraction", "working_memory"],
  },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedSupportNeeds, setSelectedSupportNeeds] = useState<Set<SupportNeed>>(new Set());
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType | "all">("all");
  const [selectedSetupEffort, setSelectedSetupEffort] = useState<SetupEffort | "all">("all");
  const [selectedSensoryLoad, setSelectedSensoryLoad] = useState<SensoryLoad | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const availableSupportNeeds = useMemo(() => {
    const needsSet = new Set<SupportNeed>();
    resources.forEach((resource) => {
      resource.support_needs.forEach((need) => needsSet.add(need));
    });
    return Array.from(needsSet).sort((a, b) =>
      SUPPORT_NEED_LABELS[a].localeCompare(SUPPORT_NEED_LABELS[b])
    );
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.domain.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedCategory !== "all" && resource.category !== selectedCategory) {
        return false;
      }

      if (selectedSupportNeeds.size > 0) {
        const hasSelectedNeed = resource.support_needs.some((need) =>
          selectedSupportNeeds.has(need)
        );
        if (!hasSelectedNeed) return false;
      }

      if (selectedPriceType !== "all" && resource.price_type !== selectedPriceType) {
        return false;
      }

      if (selectedSetupEffort !== "all" && resource.setup_effort !== selectedSetupEffort) {
        return false;
      }

      if (selectedSensoryLoad !== "all" && resource.sensory_load !== selectedSensoryLoad) {
        return false;
      }

      if (featuredOnly && !resource.featured) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedSupportNeeds,
    selectedPriceType,
    selectedSetupEffort,
    selectedSensoryLoad,
    featuredOnly,
  ]);

  const toggleSupportNeed = (need: SupportNeed) => {
    const newSet = new Set(selectedSupportNeeds);
    if (newSet.has(need)) {
      newSet.delete(need);
    } else {
      newSet.add(need);
    }
    setSelectedSupportNeeds(newSet);
  };

  const selectFeelingGroup = (groupKey: string) => {
    const group = FEELING_GROUPS[groupKey];
    if (group) {
      setSelectedSupportNeeds(new Set(group.needs));
      setSelectedCategory("all");
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSupportNeeds(new Set());
    setSelectedPriceType("all");
    setSelectedSetupEffort("all");
    setSelectedSensoryLoad("all");
    setFeaturedOnly(false);
  };

  if (!dataExists) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg border border-stone-200 dark:border-stone-700">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Welcome to Lydia Studio Resources
          </h1>
          <p className="text-stone-700 dark:text-stone-300 mb-6">
            A curated menu of tools, practices, and supports for focus, time awareness, and learning.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              No resources yet
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              To get started:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
              <li>Download your approved resources from Google Sheets as CSV</li>
              <li>Save the file as <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">data/approved.csv</code></li>
              <li>Run <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">npm run build:data</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg border border-stone-200 dark:border-stone-700">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Lydia Studio Resources
          </h1>
          <p className="text-stone-700 dark:text-stone-300">
            No approved resources found. Check your data/approved.csv file.
          </p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedSupportNeeds.size > 0 ||
    selectedPriceType !== "all" || selectedSetupEffort !== "all" || selectedSensoryLoad !== "all" || featuredOnly;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 max-w-3xl">
          <div className="mb-3 text-sm text-stone-500 dark:text-stone-400">
            By Liddy 🦥✨ (Lydia Studio)
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4 leading-tight">
            A gentle library of things that help
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed">
            Tools, practices, and supports for when focus is hard, time feels invisible, or you just need a softer way through the day.
          </p>
        </header>

        <div className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/50">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
            Not sure where to start?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            If you're feeling...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(FEELING_GROUPS).map(([key, group]) => (
              <button
                key={key}
                onClick={() => selectFeelingGroup(key)}
                className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-stone-800 rounded-xl hover:shadow-md transition-all text-left border border-stone-200 dark:border-stone-700 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <span className="text-3xl">{group.emoji}</span>
                <span className="text-stone-800 dark:text-stone-200 font-medium">
                  {group.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Search for something specific..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 text-lg rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md"
                  : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-500"
              }`}
            >
              All
            </button>
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-500"
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>

          <details className="group">
            <summary className="cursor-pointer text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform">▸</span>
              More filters
            </summary>
            <div className="mt-6 space-y-6 pl-6">
              {availableSupportNeeds.length > 0 && selectedSupportNeeds.size === 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
                    What helps with
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSupportNeeds.map((need) => (
                      <button
                        key={need}
                        onClick={() => toggleSupportNeed(need)}
                        className="px-4 py-2 rounded-full text-sm bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-500 transition-all"
                      >
                        {SUPPORT_NEED_LABELS[need]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Price
                  </label>
                  <select
                    value={selectedPriceType}
                    onChange={(e) => setSelectedPriceType(e.target.value as PriceType | "all")}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Any</option>
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Setup effort
                  </label>
                  <select
                    value={selectedSetupEffort}
                    onChange={(e) => setSelectedSetupEffort(e.target.value as SetupEffort | "all")}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Any</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Sensory load
                  </label>
                  <select
                    value={selectedSensoryLoad}
                    onChange={(e) => setSelectedSensoryLoad(e.target.value as SensoryLoad | "all")}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Any</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </details>

          {selectedSupportNeeds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-stone-600 dark:text-stone-400">Filtering by:</span>
              {Array.from(selectedSupportNeeds).map((need) => (
                <button
                  key={need}
                  onClick={() => toggleSupportNeed(need)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {SUPPORT_NEED_LABELS[need]}
                  <span className="text-xs">✕</span>
                </button>
              ))}
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 underline decoration-dotted transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-2">
              No matches found
            </p>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters and start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
