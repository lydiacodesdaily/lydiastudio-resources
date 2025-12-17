"use client";

import { useState } from "react";
import type { Resource } from "@/types/resource";
import { SUPPORT_NEED_LABELS } from "@/types/resource";

const CATEGORY_ICONS: Record<Resource["category"], string> = {
  tool: "🔧",
  method: "📋",
  community: "👥",
  content: "📚",
  physical: "⏰",
};

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [imageError, setImageError] = useState(false);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${resource.domain}&sz=128`;

  const primaryNeeds = resource.support_needs.slice(0, 3);
  const hasMore = resource.support_needs.length > 3;

  return (
    <article className="bg-white dark:bg-stone-800 rounded-xl p-6 hover:shadow-lg transition-all border border-stone-200 dark:border-stone-700 group">
      <div className="flex gap-5">
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
          {!imageError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-14 h-14 rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center text-3xl bg-stone-100 dark:bg-stone-700 rounded-lg">
              {CATEGORY_ICONS[resource.category]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-xl text-stone-900 dark:text-stone-100 mb-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:underline decoration-2 underline-offset-2"
            >
              {resource.title}
            </a>
          </h3>

          <p className="text-base text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">
            {resource.why_it_helps}
          </p>

          {resource.support_needs.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">
                Good for:
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryNeeds.map((need) => (
                  <span
                    key={need}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {SUPPORT_NEED_LABELS[need]}
                  </span>
                ))}
                {hasMore && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-stone-500 dark:text-stone-400">
                    +{resource.support_needs.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
            <span className="capitalize">{resource.price_type}</span>
            <span>·</span>
            <span className="capitalize">{resource.setup_effort} setup</span>
            <span>·</span>
            <span className="capitalize">{resource.sensory_load} sensory load</span>
            <span>·</span>
            <span className="text-stone-400 dark:text-stone-500">{resource.domain}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
