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
  const [selectedFeelingGroup, setSelectedFeelingGroup] = useState<string | null>(null);

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

  // Group resources by sections
  const groupedResources = useMemo(() => {
    const groups: Record<string, Resource[]> = {
      featured: [],
      time: [],
      getting_started: [],
      communities: [],
      other: [],
    };

    filteredResources.forEach((resource) => {
      if (resource.featured) {
        groups.featured.push(resource);
      } else if (resource.support_needs.includes("time_blindness") || resource.support_needs.includes("transitioning")) {
        groups.time.push(resource);
      } else if (resource.setup_effort === "low" || resource.category === "method") {
        groups.getting_started.push(resource);
      } else if (resource.category === "community") {
        groups.communities.push(resource);
      } else {
        groups.other.push(resource);
      }
    });

    return groups;
  }, [filteredResources]);

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
      setSelectedFeelingGroup(groupKey);
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
    setSelectedFeelingGroup(null);
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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 max-w-3xl">
          <div className="mb-3 text-sm" style={{ color: 'var(--muted)' }}>
            By Liddy 🦥✨ (Lydia Studio)
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--foreground)' }}>
            A gentle library of things that help
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
            Tools, practices, and supports for when focus is hard, time feels invisible, or you just need a softer way through the day.
          </p>
          <div className="mt-6">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeLFxEkB1WoeYkZT4g6qnwdcDMTJk4HaHjIJumPMIjFB6RDAg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-medium transition-all hover:shadow-md"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <span>✨</span>
              Submit a resource
              <span style={{ color: 'var(--muted)' }}>→</span>
            </a>
          </div>
        </header>

        <div className="mb-12 rounded-2xl p-8 border-2 shadow-sm" style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--accent)',
          opacity: 0.98
        }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Not sure where to start?
            </h2>
            <p className="text-base" style={{ color: 'var(--muted)' }}>
              Choose what you're feeling right now, and we'll show you tools that might help
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(FEELING_GROUPS).map(([key, group]) => {
              const isSelected = selectedFeelingGroup === key;
              return (
                <button
                  key={key}
                  onClick={() => selectFeelingGroup(key)}
                  className="flex items-center gap-3 px-6 py-5 rounded-2xl hover:shadow-md transition-all text-left border-2"
                  style={{
                    background: isSelected ? 'var(--accent-soft)' : 'var(--background)',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                    boxShadow: isSelected ? '0 0 0 3px var(--accent-soft)' : undefined,
                    transform: isSelected ? 'scale(1.02)' : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--accent-soft)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span className="text-4xl">{group.emoji}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-base block" style={{ color: 'var(--foreground)' }}>
                      I feel {group.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-10 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Search for something specific..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 text-lg rounded-2xl border focus:outline-none focus:ring-2 shadow-sm transition-all"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-soft)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '';
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
              style={{
                background: selectedCategory === "all" ? 'var(--accent)' : 'var(--card-bg)',
                color: selectedCategory === "all" ? '#fff' : 'var(--foreground)',
                border: selectedCategory === "all" ? 'none' : `1px solid var(--border)`
              }}
            >
              All
            </button>
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
                style={{
                  background: selectedCategory === category ? 'var(--accent)' : 'var(--card-bg)',
                  color: selectedCategory === category ? '#fff' : 'var(--foreground)',
                  border: selectedCategory === category ? 'none' : `1px solid var(--border)`
                }}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>

          <details className="group">
            <summary className="cursor-pointer text-sm list-none flex items-center gap-2 transition-colors" style={{ color: 'var(--muted)' }}>
              <span className="group-open:rotate-90 transition-transform">▸</span>
              More filters
            </summary>
            <div className="mt-6 space-y-6 pl-6">
              {availableSupportNeeds.length > 0 && selectedSupportNeeds.size === 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    What helps with
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSupportNeeds.map((need) => (
                      <button
                        key={need}
                        onClick={() => toggleSupportNeed(need)}
                        className="px-4 py-2 rounded-full text-sm border transition-all"
                        style={{
                          background: 'var(--card-bg)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      >
                        {SUPPORT_NEED_LABELS[need]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Price
                  </label>
                  <select
                    value={selectedPriceType}
                    onChange={(e) => setSelectedPriceType(e.target.value as PriceType | "all")}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all"
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <option value="all">Any</option>
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Setup effort
                  </label>
                  <select
                    value={selectedSetupEffort}
                    onChange={(e) => setSelectedSetupEffort(e.target.value as SetupEffort | "all")}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all"
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <option value="all">Any</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Sensory load
                  </label>
                  <select
                    value={selectedSensoryLoad}
                    onChange={(e) => setSelectedSensoryLoad(e.target.value as SensoryLoad | "all")}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all"
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
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
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Filtering by:</span>
              {Array.from(selectedSupportNeeds).map((need) => (
                <button
                  key={need}
                  onClick={() => toggleSupportNeed(need)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors"
                  style={{
                    background: 'var(--accent-soft)',
                    borderColor: 'var(--accent)',
                    color: 'var(--foreground)'
                  }}
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
              className="text-sm underline decoration-dotted transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              Clear all filters
            </button>
          )}
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{
            background: 'var(--card-bg)',
            borderColor: 'var(--border)'
          }}>
            <p className="text-lg mb-2" style={{ color: 'var(--muted)' }}>
              No matches found
            </p>
            <button
              onClick={clearAllFilters}
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Clear filters and start over
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {groupedResources.featured.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
                  <span className="text-xl">⭐</span>
                  Featured
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {groupedResources.featured.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {groupedResources.time.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
                  <span className="text-xl">🕒</span>
                  Time awareness tools
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {groupedResources.time.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {groupedResources.getting_started.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
                  <span className="text-xl">🧠</span>
                  Getting started / low effort
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {groupedResources.getting_started.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {groupedResources.communities.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
                  <span className="text-xl">🧩</span>
                  Communities & body-doubling
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {groupedResources.communities.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {groupedResources.other.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
                  <span className="text-xl">✨</span>
                  More resources
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {groupedResources.other.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
