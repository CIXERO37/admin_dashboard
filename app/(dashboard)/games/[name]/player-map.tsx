"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import type { PlayerLocationData } from "./actions";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface PlayerMapProps {
  locations: PlayerLocationData[];
}

function PlayerMapInner({ locations }: PlayerMapProps) {
  const maxCount = locations.length > 0 ? locations[0].count : 1;

  return (
    <div className="w-full rounded-lg overflow-hidden bg-[#1a1a2e] border border-white/5 relative">
      <ComposableMap
        width={900}
        height={380}
        projectionConfig={{
          scale: 155,
          center: [15, 5],
        }}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHighlighted = locations.some(
                (l) =>
                  (l.numeric_code && l.numeric_code === geo.id) ||
                  l.iso3 === geo.properties.ISO_A3 ||
                  l.iso3 === geo.id
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? "#2d3a2d" : "#252535"}
                  stroke="#353550"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: "#2d3a2d",
                      stroke: "#555",
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
        {locations.map((loc) => {
          // Scale bubble size based on count
          const r = Math.max(10, Math.min(22, (loc.count / maxCount) * 22));
          return (
            <Marker
              key={loc.iso3}
              coordinates={[loc.longitude, loc.latitude]}
            >
              {/* Outer glow */}
              <circle
                r={r + 4}
                fill="#7c3aed"
                fillOpacity={0.15}
              />
              {/* Main bubble */}
              <circle
                r={r}
                fill="#7c3aed"
                fillOpacity={0.85}
                stroke="#a78bfa"
                strokeWidth={1.5}
              />
              {/* Count text */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: Math.max(9, r * 0.75),
                  fontWeight: 700,
                  fill: "#fff",
                  pointerEvents: "none",
                }}
              >
                {loc.count}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}

export const PlayerMap = memo(PlayerMapInner);
