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
  const [showDetails, setShowDetails] = useState(false);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${resource.domain}&sz=128`;

  const primaryNeeds = resource.support_needs.slice(0, 2);
  const hasMore = resource.support_needs.length > 2;

  return (
    <article className="rounded-2xl p-5 transition-all border group" style={{
      background: 'var(--card-bg)',
      borderColor: 'var(--border)',
      opacity: 0.95
    }}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          {!imageError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-12 h-12 rounded-xl opacity-90"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-2xl rounded-xl opacity-90" style={{
              background: 'var(--background)'
            }}>
              {CATEGORY_ICONS[resource.category]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1.5" style={{ color: 'var(--foreground)' }}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:underline decoration-2 underline-offset-2"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}
            >
              {resource.title}
            </a>
          </h3>

          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
            {resource.why_it_helps}
          </p>

          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="text-xs transition-colors hover:underline"
              style={{ color: 'var(--muted)' }}
            >
              Show details
            </button>
          ) : (
            <div className="space-y-3">
              {resource.support_needs.length > 0 && (
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
                    Good for:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryNeeds.map((need) => (
                      <span
                        key={need}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs border"
                        style={{
                          background: 'var(--accent-soft)',
                          borderColor: 'var(--accent)',
                          color: 'var(--foreground)',
                          opacity: 0.9
                        }}
                      >
                        {SUPPORT_NEED_LABELS[need]}
                      </span>
                    ))}
                    {hasMore && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs" style={{ color: 'var(--muted)' }}>
                        +{resource.support_needs.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--muted)', opacity: 0.7 }}>
                <span className="capitalize">{resource.price_type}</span>
                <span>·</span>
                <span className="capitalize">{resource.setup_effort} setup</span>
                <span>·</span>
                <span className="capitalize">{resource.sensory_load} sensory</span>
                <span>·</span>
                <span>{resource.domain}</span>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="text-xs transition-colors hover:underline"
                style={{ color: 'var(--muted)' }}
              >
                Hide details
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
