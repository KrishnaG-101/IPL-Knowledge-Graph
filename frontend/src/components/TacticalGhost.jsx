import React from 'react';
import '../index.css';

const TacticalGhost = ({ activeInsight }) => {
  // activeInsight represents the JSON payload from the Reasoning Path
  
  if (!activeInsight || !activeInsight.anomaly_detected) {
    return (
      <div className="tactical-map-container">
         <div className="pitch-graphic"></div>
         <div className="hud-overlay">
           <div className="hud-title">SYSTEM NOMINAL</div>
           <div className="hud-description">Analyzing field placements... No invisible shifts detected.</div>
         </div>
      </div>
    );
  }

  const { trap_type, description, movement } = activeInsight;

  return (
    <div className="tactical-map-container">
      {/* Central Pitch Graphic */}
      <div className="pitch-graphic"></div>

      {movement && (
        <>
          {/* Ghost Position (Previous Location) */}
          <div 
            className="fielder-node ghost"
            style={{ left: `${movement.prev_x}%`, top: `${movement.prev_y}%` }}
            title={`Previous Position: ${movement.fielder}`}
          >
            {movement.fielder.substring(0, 2).toUpperCase()}
          </div>

          {/* Dotted Movement Path */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
             <line 
               x1={`${movement.prev_x}%`} 
               y1={`${movement.prev_y}%`} 
               x2={`${movement.curr_x}%`} 
               y2={`${movement.curr_y}%`} 
               stroke="var(--secondary-accent)" 
               strokeWidth="2" 
               strokeDasharray="4 4" 
               opacity="0.6"
             />
             {/* Small animated circle along the path could go here for extra polish */}
          </svg>

          {/* Current Solid Position */}
          <div 
            className="fielder-node current"
            style={{ left: `${movement.curr_x}%`, top: `${movement.curr_y}%` }}
            title={`Current Position: ${movement.fielder}`}
          >
            {movement.fielder.substring(0, 2).toUpperCase()}
          </div>
        </>
      )}

      {/* High-Contrast HUD Alert Overlay */}
      <div className="hud-overlay">
        <div className="hud-title" style={{ color: 'var(--tertiary)' }}>
          TACTICAL SHIFT // {trap_type.toUpperCase()}
        </div>
        <div className="hud-description">{description}</div>
      </div>
    </div>
  );
};

export default TacticalGhost;
