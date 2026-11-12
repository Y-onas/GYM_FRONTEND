import { useState, type KeyboardEvent } from 'react';
import { FLOORS, type FloorId } from '../data/house';
import { Img, PillarTag } from './primitives';
import './building.css';

/**
 * Architectural cross-section of the ironworks. Floors are selectable from the
 * drawing (pointer) or the level list (keyboard / screen reader).
 */
export function BuildingSection({ initial = 'l0' }: { initial?: FloorId }) {
  const [active, setActive] = useState<FloorId>(initial);
  const [hover, setHover] = useState<FloorId | null>(null);
  const shown = hover ?? active;
  const floor = FLOORS.find((f) => f.id === shown)!;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = FLOORS[(i + d + FLOORS.length) % FLOORS.length];
    setActive(next.id);
    document.getElementById(`floor-tab-${next.id}`)?.focus();
  };

  return (
    <div className="bsec" data-active={shown}>
      <div className="bsec__levels" role="tablist" aria-label="Floors of the house" aria-orientation="vertical">
        {FLOORS.map((f, i) => (
          <button
            key={f.id}
            id={`floor-tab-${f.id}`}
            type="button"
            role="tab"
            aria-selected={active === f.id}
            aria-controls="floor-panel"
            tabIndex={active === f.id ? 0 : -1}
            className={`bsec__level ${shown === f.id ? 'is-shown' : ''}`}
            onClick={() => setActive(f.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="bsec__lvl t-label">{f.level}</span>
            <span className="bsec__lname">{f.name}</span>
            <span className="bsec__larea t-label">{f.area}</span>
          </button>
        ))}
      </div>

      <div className="bsec__drawing" onMouseLeave={() => setHover(null)}>
        <Drawing shown={shown} onHover={setHover} onPick={setActive} />
      </div>

      <div className="bsec__panel" id="floor-panel" role="tabpanel" aria-labelledby={`floor-tab-${active}`} aria-live="polite">
        <div className="bsec__panel-in" key={floor.id}>
          <div className="bsec__shot">
            <Img name={floor.image} alt={`${floor.name}, level ${floor.level}`} sizes="(max-width: 900px) 100vw, 32vw" />
          </div>
          <div className="bsec__head">
            <span className="t-label">
              Level {floor.level} · {floor.area}
            </span>
            <PillarTag pillar={floor.pillar} />
          </div>
          <h3 className="t-h3">{floor.name}</h3>
          <p className="bsec__sum">{floor.summary}</p>
          <div className="bsec__stat">
            <span className="t-num bsec__statv">{floor.stat.value}</span>
            <span className="t-label t-label--muted">{floor.stat.label}</span>
          </div>
          <ul className="bsec__feat">
            {floor.features.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const FLOOR_BOXES: Record<FloorId, { y: number; h: number }> = {
  l2: { y: 120, h: 110 },
  l1: { y: 230, h: 110 },
  l0: { y: 340, h: 160 },
  b1: { y: 500, h: 104 },
};

function Drawing({ shown, onHover, onPick }: { shown: FloorId; onHover: (f: FloorId) => void; onPick: (f: FloorId) => void }) {
  const X0 = 60;
  const W = 680;
  const teeth = 5;
  const tw = W / teeth;
  const roof = Array.from({ length: teeth }, (_, i) => {
    const x = X0 + i * tw;
    return `M${x} 120 L${x} 66 L${x + tw} 120`;
  }).join(' ');

  return (
    <svg className="bsec__svg" viewBox="0 0 800 640" role="img" aria-label="Cross-section of the BASALT building showing four levels">
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className="bsec__hatch" />
        </pattern>
      </defs>

      {/* earth */}
      <rect x="0" y="500" width="800" height="140" fill="url(#hatch)" opacity="0.5" />
      <rect x={X0} y="500" width={W} height="104" className="bsec__void" />
      <line x1="0" y1="500" x2="800" y2="500" className="bsec__ground" />
      <text x="8" y="494" className="bsec__note">
        STREET ±0.00
      </text>

      {/* chimney + roof */}
      <path d="M676 120 V14 H704 V120" className="bsec__stroke" />
      <path d="M672 14 H708" className="bsec__stroke" />
      <path d={roof} className="bsec__stroke" />
      {Array.from({ length: teeth }, (_, i) => {
        const x = X0 + i * tw;
        return [0, 1, 2].map((k) => <line key={`${i}-${k}`} x1={x + 4 + k * 6} y1={72 + k * 2} x2={x + 4 + k * 6} y2="118" className="bsec__glaze" />);
      })}

      {/* floors */}
      {(Object.keys(FLOOR_BOXES) as FloorId[]).map((id) => {
        const b = FLOOR_BOXES[id];
        const f = FLOORS.find((x) => x.id === id)!;
        return (
          <g
            key={id}
            className={`bsec__floor ${shown === id ? 'is-on' : ''}`}
            onMouseEnter={() => onHover(id)}
            onClick={() => onPick(id)}
          >
            <rect x={X0} y={b.y} width={W} height={b.h} className="bsec__box" />
            <rect x={X0} y={b.y} width="4" height={b.h} className="bsec__marker" />
            <text x={X0 + 14} y={b.y + 20} className="bsec__lbl">
              {f.level}
            </text>
            <text x={X0 + 14} y={b.y + 34} className="bsec__lbl bsec__lbl--name">
              {f.name.toUpperCase()}
            </text>
            <FloorGlyphs id={id} y={b.y} h={b.h} />
          </g>
        );
      })}

      {/* dimension line */}
      <g className="bsec__dim">
        <line x1="770" y1="120" x2="770" y2="604" />
        <line x1="764" y1="120" x2="776" y2="120" />
        <line x1="764" y1="604" x2="776" y2="604" />
        <text x="760" y="366" transform="rotate(-90 760 366)">
          18.4 M
        </text>
      </g>
    </svg>
  );
}

function FloorGlyphs({ id, y, h }: { id: FloorId; y: number; h: number }) {
  const base = y + h;
  if (id === 'l2') {
    return (
      <g className="bsec__glyphs">
        <line x1="300" y1={y} x2="300" y2={base} className="bsec__wall" />
        <line x1="520" y1={y} x2="520" y2={base} className="bsec__wall" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M150 ${y + 56 + k * 14} q 12 -8 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} className="bsec__fine" />
        ))}
        {Array.from({ length: 6 }, (_, k) => (
          <g key={k} transform={`translate(${326 + k * 32} ${base - 26})`}>
            <circle cx="0" cy="10" r="7" className="bsec__fine" />
            <circle cx="20" cy="10" r="7" className="bsec__fine" />
            <path d="M0 10 L10 -2 L20 10 M10 -2 L12 -8" className="bsec__fine" />
          </g>
        ))}
        {Array.from({ length: 5 }, (_, k) => (
          <rect key={k} x={544 + k * 36} y={base - 14} width="28" height="6" className="bsec__fine" />
        ))}
      </g>
    );
  }
  if (id === 'l1') {
    return (
      <g className="bsec__glyphs">
        {Array.from({ length: 5 }, (_, k) => (
          <g key={k} transform={`translate(${150 + k * 46} ${base - 22})`}>
            <path d="M0 20 Q18 10 36 20" className="bsec__fine" />
            <line x1="30" y1="20" x2="34" y2="-6" className="bsec__fine" />
          </g>
        ))}
        {Array.from({ length: 4 }, (_, k) => (
          <rect key={k} x={400 + k * 30} y={base - 12} width="24" height="4" className="bsec__fine" />
        ))}
        <rect x="540" y={base - 16} width="190" height="12" className="bsec__fine" />
        <line x1="540" y1={base - 10} x2="730" y2={base - 10} className="bsec__fine bsec__dash" />
        <path d={`M560 ${base - 16} l 10 -14 h 14 l 4 14`} className="bsec__fine" />
      </g>
    );
  }
  if (id === 'l0') {
    return (
      <g className="bsec__glyphs">
        {Array.from({ length: 6 }, (_, k) => (
          <path key={`t${k}`} d={`M${60 + k * 113} ${y} l 56 28 l 57 -28`} className="bsec__fine" />
        ))}
        <line x1="60" y1={y + 28} x2="740" y2={y + 28} className="bsec__fine" />
        {Array.from({ length: 7 }, (_, k) => {
          const x = 150 + k * 82;
          return (
            <g key={k}>
              <rect x={x} y={base - 92} width="44" height="92" className="bsec__fine" />
              <line x1={x - 14} y1={base - 52} x2={x + 58} y2={base - 52} className="bsec__strong" />
              <rect x={x - 12} y={base - 64} width="6" height="24" className="bsec__plate" />
              <rect x={x + 50} y={base - 64} width="6" height="24" className="bsec__plate" />
            </g>
          );
        })}
      </g>
    );
  }
  return (
    <g className="bsec__glyphs">
      <rect x="150" y={base - 46} width="300" height="40" className="bsec__fine" />
      {[0, 1].map((k) => (
        <path key={k} d={`M160 ${base - 34 + k * 12} q 14 -6 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0`} className="bsec__fine" />
      ))}
      <rect x="480" y={base - 70} width="70" height="64" className="bsec__fine" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${496 + k * 18} ${base - 24} q -6 -10 0 -20 t 0 -20`} className="bsec__fine" />
      ))}
      <rect x="570" y={base - 30} width="44" height="24" className="bsec__fine" />
      <line x1="574" y1={base - 20} x2="610" y2={base - 20} className="bsec__fine bsec__dash" />
      {[0, 1].map((k) => (
        <rect key={k} x={634 + k * 50} y={base - 60} width="40" height="54" className="bsec__fine" />
      ))}
    </g>
  );
}
