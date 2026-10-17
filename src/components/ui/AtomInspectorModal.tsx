'use client';

import React from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { X, MousePointer2, Orbit, ShieldCheck } from 'lucide-react';

export default function AtomInspectorModal() {
  const inspectedAtom = useStore((s: StoreState) => s.inspectedAtom);
  const setInspectedAtom = useStore((s: StoreState) => s.setInspectedAtom);
  if (!inspectedAtom) return null;

  return (
    <>
      <button
        className="atom-inspector-backdrop"
        onClick={() => setInspectedAtom(null)}
        aria-label="Đóng bảng nguyên tử"
        type="button"
      />
      <aside className="atom-inspector" aria-label="Hồ sơ nguyên tử">
        <div className="atom-inspector-card">

        {/* Header */}
        <div className="atom-inspector-header">
          <div className="flex items-center gap-3.5">
            {/* Chunky Periodic Tile */}
            <div className="periodic-tile" style={{ borderColor: inspectedAtom.color }}>
              <span className="text-[10px] font-mono opacity-85 leading-none">{inspectedAtom.atomicNumber}</span>
              <span className="text-xl font-extrabold leading-tight">{inspectedAtom.element}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3>{inspectedAtom.nameVi}</h3>
                <span className="atom-name-en">({inspectedAtom.nameEn})</span>
              </div>
              <span className="text-xs text-[#1cb0f6] font-bold tracking-wider uppercase block mt-0.5">
                {inspectedAtom.categoryVi}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setInspectedAtom(null);
            }}
            className="atom-close"
            title="Đóng bảng soi nguyên tử"
          >
            <X size={16} />
          </button>
        </div>

        {/* Atom Specs Grid: Micro-card cells with high contrast and p-3 */}
        <div className="atom-spec-grid">
          <div className="atom-spec">
            <span>Khối lượng nguyên tử</span>
            <span className="font-mono font-black text-[#1cb0f6] text-sm">{inspectedAtom.atomicMass}</span>
          </div>

          <div className="atom-spec">
            <span>Bán kính nguyên tử</span>
            <span className="font-mono font-black text-[#58cc02] text-sm">{inspectedAtom.atomicRadiusPm} pm</span>
          </div>

          <div className="atom-spec">
            <span>Cấu hình electron</span>
            <span className="font-mono font-extrabold text-[#ce82ff] text-xs leading-normal">{inspectedAtom.electronConfig}</span>
          </div>

          <div className="atom-spec">
            <span>Độ âm điện (Pauling)</span>
            <span className="font-mono font-black text-[#ffc800] text-sm">{inspectedAtom.electronegativity || 'N/A'}</span>
          </div>
        </div>

        {/* Coordination & Bond Details */}
        <div className="atom-bond-info">
          <div className="flex items-center justify-between">
            <span>
              <Orbit size={14} className="text-[#1cb0f6]" />
              Hình học phối trí:
            </span>
            <strong>{inspectedAtom.coordination}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <ShieldCheck size={14} className="text-[#58cc02]" />
              Bản chất liên kết:
            </span>
            <strong>{inspectedAtom.bondType}</strong>
          </div>
        </div>

        {/* Description */}
        <p className="atom-description">
          {inspectedAtom.descriptionVi}
        </p>

        {/* Live interaction prompt */}
        <div className="atom-inspector-foot">
          <span>
            <MousePointer2 size={13} />
            Chạm nguyên tử khác để đổi tiêu điểm
          </span>
          <span className="font-mono text-[#1cb0f6]">#Atom-{inspectedAtom.index + 1}</span>
        </div>
      </div>
    </aside>
    </>
  );
}

