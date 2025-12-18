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
    <article className="rounded-2xl p-6 hover:shadow-sm transition-all border group" style={{
      background: 'var(--card-bg)',
      borderColor: 'var(--border)'
    }}>
      <div className="flex gap-5">
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
          {!imageError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-14 h-14 rounded-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center text-3xl rounded-xl" style={{
              background: 'var(--background)'
            }}>
              {CATEGORY_ICONS[resource.category]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--foreground)' }}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors group-hover:underline decoration-2 underline-offset-2"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}
            >
              {resource.title}
            </a>
          </h3>

          <p className="text-base mb-4 leading-relaxed" style={{ color: 'var(--foreground)' }}>
            {resource.why_it_helps}
          </p>

          {resource.support_needs.length > 0 && (
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                Good for:
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryNeeds.map((need) => (
                  <span
                    key={need}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border"
                    style={{
                      background: 'var(--accent-soft)',
                      borderColor: 'var(--accent)',
                      color: 'var(--foreground)'
                    }}
                  >
                    {SUPPORT_NEED_LABELS[need]}
                  </span>
                ))}
                {hasMore && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm" style={{ color: 'var(--muted)' }}>
                    +{resource.support_needs.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
            <span className="capitalize">{resource.price_type}</span>
            <span>·</span>
            <span className="capitalize">{resource.setup_effort} setup</span>
            <span>·</span>
            <span className="capitalize">{resource.sensory_load} sensory load</span>
            <span>·</span>
            <span>{resource.domain}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
