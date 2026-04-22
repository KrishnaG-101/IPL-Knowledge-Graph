import React from 'react';
import './index.css';

const App = () => {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-text">MISSION_CONTROL</div>
          <div className="system-active">
            <div className="dot"></div>
            SYSTEM_ACTIVE
          </div>
          <div className="sector-name">SECTOR_01</div>
        </div>
        <div className="nav-menu">
          <div className="nav-item active">
            <i>⊞</i> STRATEGIC_OVERVIEW
          </div>
          <div className="nav-item">
            <i>((•))</i> LIVE_TELEMETRY
          </div>
          <div className="nav-item">
            <i>👥</i> SQUAD_INTELLIGENCE
          </div>
          <div className="nav-item">
            <i>📈</i> TACTICAL_ANALYSIS
          </div>
          <div className="nav-item">
            <i>⏱</i> MISSION_LOGS
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <div className="search-box">
            <i style={{opacity: 0.5}}>🔍</i>
            <input type="text" placeholder="QUERY_DATABASE" />
          </div>
          <div className="topbar-icons">
            <span style={{color: '#ffb4ab'}}>🔔</span>
            <span>👤</span>
            <span>⚙️</span>
          </div>
        </div>

        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>STRATEGIC_OVERVIEW</h1>
            <div className="dashboard-subtitle">MATCH SECTOR: ALPHA-9 | INNINGS 02</div>
          </div>
          <div className="telemetry-btn">
            <i>🌀</i> TELEMETRY_LINK_STABLE
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Live Score Panel */}
          <div className="panel">
            <div className="panel-header">
              <span>LIVE_SCORE_DATA</span>
              <span style={{color: 'var(--text-active-green)'}}>📊</span>
            </div>
            <div className="score-main">
              <div className="score-number">184<span style={{color: 'var(--text-grey)'}}>/4</span></div>
              <div className="overs">OVERS: 16.3</div>
            </div>
            <div className="score-stats">
              <div className="stat-box">
                <h4>CRR</h4>
                <div className="crr">11.15</div>
              </div>
              <div className="stat-box" style={{textAlign: 'right'}}>
                <h4>REQ</h4>
                <div className="req">12.50</div>
              </div>
            </div>
          </div>

          {/* Partnership Network Panel */}
          <div className="panel">
            <div className="panel-header" style={{marginBottom: 0}}>
              <span>PARTNERSHIP_NETWORK</span>
              <div className="network-toggles">
                <span className="active">LIVE_NODE</span>
                <span>HISTORY</span>
              </div>
            </div>
            <div className="network-graph">
               <div className="line-p1-b1"></div>
               <div className="line-p1-p2"></div>
               <div className="node p1">
                 <div className="node-box">P1</div>
                 <div style={{textAlign: 'center'}}>45*(22)</div>
               </div>
               <div className="node b1">
                 <div className="node-box">B1</div>
                 <div style={{textAlign: 'center', color: 'var(--text-red)'}}>3.3-0-42-1</div>
               </div>
               <div className="node p2">
                 <div className="node-box">P2</div>
                 <div style={{textAlign: 'center'}}>12(8)</div>
               </div>
            </div>
          </div>

          {/* Tactical Shift Panel */}
          <div className="panel tactical-shift">
            <div className="panel-header">
              <span>⚠️ TACTICAL_SHIFT_DETECTED</span>
            </div>
            <div className="tactical-content">
              <div className="pitch-mini">
                 <div className="pitch-rect"></div>
                 <div className="pitch-dot" style={{top: '10px', right: '20px'}}></div>
                 <div className="pitch-dot" style={{bottom: '20px', left: '20px', opacity: 0.5}}></div>
                 <div className="pitch-ring"></div>
              </div>
              <div className="tactical-text">
                <p>Deep mid-wicket moved square. Third man brought inside the circle.</p>
                <div className="probability-box">
                  PROBABILITY: BOUNCER ANTICIPATED (84%)
                </div>
              </div>
            </div>
          </div>

          {/* Match Trajectory Panel */}
          <div className="panel">
            <div className="trajectory-header">
              <span>MATCH_TRAJECTORY</span>
              <span style={{color: 'var(--text-active-green)'}}>BAT 62%</span>
            </div>
            <div className="traj-chart">
               <div className="traj-line"></div>
               <div className="traj-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
