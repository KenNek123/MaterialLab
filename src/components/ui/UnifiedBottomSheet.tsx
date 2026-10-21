'use client';

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  BookOpen,
  Columns2,
  Box,
  Sparkles,
  Info,
  LucideIcon,
} from 'lucide-react';
import { MaterialData, StoreState, useStore, ZoomLayer } from '@/store/useStore';
import { MATERIALS, MATERIAL_MAP } from '@/data/materials';
import { sound } from '@/lib/soundFx';
import MaterialBadge from './MaterialBadge';

export interface StageConfig {
  id: ZoomLayer;
  label: string;
  shortLabel: string;
  caption: string;
  scale: string;
  icon: LucideIcon;
  distance: number;
  progress: number;
}

interface UnifiedBottomSheetProps {
  material: MaterialData;
  activeStage: StageConfig;
  stages: StageConfig[];
  onSelectStage: (stage: StageConfig) => void;
  onOpenDetail: () => void;
  onOpenCompare: () => void;
  isDual3DView: boolean;
  onToggleDual3DView: () => void;
}

export default function UnifiedBottomSheet({
  material,
  activeStage,
  stages,
  onSelectStage,
  onOpenDetail,
  onOpenCompare,
  isDual3DView,
  onToggleDual3DView,
}: UnifiedBottomSheetProps) {
  const isZenMode = useStore((s: StoreState) => s.isZenMode);
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const structureLayerCount = useStore((s: StoreState) => s.structureLayerCount);
  const setStructureLayerCount = useStore((s: StoreState) => s.setStructureLayerCount);

  // Synchronized Bottom Sheet State from useStore (Task 4)
  const isExpanded = useStore((s: StoreState) => s.isBottomSheetOpen);
  const setIsExpanded = useStore((s: StoreState) => s.setIsBottomSheetOpen);
  const isBottomDockHidden = useStore((s: StoreState) => s.isBottomDockHidden);
  const setIsBottomDockHidden = useStore((s: StoreState) => s.setIsBottomDockHidden);

  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const matA = MATERIAL_MAP.get(compareMaterialA) ?? material;
  const matB = MATERIAL_MAP.get(compareMaterialB) ?? MATERIALS[1] ?? material;

  // Requirement: Bottom toolbar is hidden during presentation mode and only restored when tour stops
  if (isZenMode || isTourActive) return null;

  // Scientific info based on current zoom layer
  const getStageDetails = (mat: MaterialData, layer: ZoomLayer) => {
    if (layer === 'micro') {
      return {
        eyebrow: 'Cấp độ 2 · Ô mạng cơ sở',
        title: 'Mạng tinh thể tuần hoàn',
        summary: `Các nguyên tử tuần hoàn tạo thành ${mat.molecularInfo.latticeType.toLocaleLowerCase('vi')}.`,
        focus: 'Cách các hạt sắp xếp lặp lại trong không gian 3 chiều tạo nên cấu trúc bền vững.',
        factLabel: 'Hệ tinh thể',
        fact: mat.molecularInfo.crystalSystem,
      };
    }
    if (layer === 'molecular') {
      return {
        eyebrow: 'Cấp độ 3 · Cấp độ nguyên tử',
        title: 'Liên kết & Tương tác hạt',
        summary: `Mạng liên kết bền vững được giữ bởi ${mat.molecularInfo.bonds.type.toLocaleLowerCase('vi')}.`,
        focus: 'Chạm vào bất kỳ quả cầu nguyên tử nào để mở bảng hồ sơ khoa học chi tiết.',
        factLabel: 'Độ dài liên kết',
        fact: mat.molecularInfo.bondLength,
      };
    }
    return {
      eyebrow: 'Cấp độ 1 · Vật thể vĩ mô',
      title: mat.objectNameVi,
      summary: `${mat.nameVi} (${mat.formula}) thuộc phân loại ${mat.categoryLabel}, ứng dụng đột phá trong khoa học công nghệ nhờ các đặc tính cơ lý vượt trội.`,
      focus: 'Xoay vật thể để quan sát hình dạng 3D, sau đó bấm chuyển nấc Ô mạng để nhìn sâu vào cấu trúc bên trong.',
      factLabel: 'Ứng dụng tiêu biểu',
      fact: mat.macroInfo.applications[0],
    };
  };

  const stageDetails = getStageDetails(material, activeLayer);
  const stageDetailsA = getStageDetails(matA, activeLayer);
  const stageDetailsB = getStageDetails(matB, activeLayer);

  return (
    <>
      <section
        className={`unified-bottom-sheet ${isExpanded ? 'is-expanded' : 'is-collapsed'} ${
          isBottomDockHidden ? 'is-dock-hidden' : ''
        }`}
        aria-label="Thanh điều hướng cấp độ và thông tin cấu trúc"
      >
        {/* ── Top Bar: Center Pull-Tab & Independent Slide-Down Button ── */}
        <div className="sheet-top-bar">
          <button
            type="button"
            className="sheet-pull-handle"
            onClick={() => {
              sound.playClick();
              setIsExpanded(!isExpanded);
            }}
            title={isExpanded ? 'Thu gọn bảng thông tin' : 'Mở rộng thông tin khoa học & công cụ'}
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                <ChevronDown size={17} />
                <span>Thu gọn</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <ChevronUp size={17} className="text-blue-600" />
                <span>Chi tiết & Công cụ</span>
              </div>
            )}
          </button>

          {/* Nút độc lập: Trượt ẩn thanh xuống dưới */}
          <button
            type="button"
            className="sheet-hide-dock-btn"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setIsExpanded(false);
              setIsBottomDockHidden(true);
            }}
            title="Trượt ẩn thanh điều hướng xuống dưới"
            aria-label="Trượt ẩn thanh xuống dưới"
          >
            <span className="hide-btn-label">Ẩn thanh</span>
            <ChevronDown size={14} className="hide-btn-icon" />
          </button>
        </div>

      {/* ── Primary Row: Segmented Stage Buttons & Quick Action Links ──── */}
      <div className="sheet-primary-row">
        {/* Segmented Stages (Vật thể / Ô mạng / Nguyên tử) */}
        <div className="sheet-stage-segments" role="tablist">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const active = stage.id === activeLayer;
            return (
              <button
                key={stage.id}
                role="tab"
                aria-selected={active}
                className={`sheet-stage-btn ${active ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  onSelectStage(stage);
                }}
                type="button"
              >
                <div className="stage-icon-wrap">
                  <Icon size={16} />
                </div>
                <div className="stage-text-wrap">
                  <span className="stage-name">{stage.label}</span>
                  <span className="stage-scale-pill">{stage.scale}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Structure Layers Switcher (Visible in Molecular/Atomic View) */}
        {activeLayer === 'molecular' && (
          <div className="flex items-center gap-1.5 bg-blue-50/95 px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs shrink-0">
            <span className="text-[11px] font-bold text-blue-700 hidden sm:inline">
              {material.id === 'cnt'
                ? 'Vách:'
                : ['teflon', 'rubber', 'kevlar'].includes(material.id)
                ? 'Sợi:'
                : 'Lớp:'}
            </span>
            <div className="flex items-center gap-1">
              {([1, 2, 3] as const).map((num) => {
                const label = `${num}`;
                const isActive = structureLayerCount === num;
                const unitTitle =
                  material.id === 'cnt'
                    ? `${num} vách đồng trục (SWCNT/DWCNT/MWCNT)`
                    : ['teflon', 'rubber', 'kevlar'].includes(material.id)
                    ? `${num} chuỗi sợi phân tử`
                    : material.id === 'buckyball'
                    ? `${num} quả bóng C60 (Monomer/Dimer/Trimer)`
                    : `${num} tầng/lớp tinh thể`;

                return (
                  <button
                    key={num}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      setStructureLayerCount(num);
                    }}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                    title={`Chuyển sang cấu trúc ${unitTitle}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Direct Actions on Primary Row */}
        <div className="sheet-quick-actions">
          <button
            type="button"
            className="sheet-quick-btn"
            onClick={() => {
              sound.playClick();
              onOpenDetail();
            }}
            title="Mở hồ sơ khoa học chi tiết"
          >
            <Info size={16} className="text-blue-600 shrink-0" />
            <span className="hidden md:inline">Hồ sơ chi tiết</span>
          </button>

          <button
            type="button"
            className="sheet-quick-btn"
            onClick={() => {
              sound.playClick();
              onOpenCompare();
            }}
            title="Mở bảng so sánh đa tầng"
          >
            <Columns2 size={16} className="text-blue-600 shrink-0" />
            <span className="hidden md:inline">So sánh</span>
          </button>
        </div>
      </div>

      {/* ── Expanded Content: Stage Information & Tools (Nested Scroll) ── */}
      {isExpanded && (
        <div className="sheet-expanded-body custom-scrollbar">
          {isDual3DView ? (
            /* Dual 3D View: Balanced side-by-side cards for Material A and Material B */
            <div className="sheet-info-grid items-stretch">
              {/* Material A Card */}
              <div className="sheet-card flex flex-col justify-between h-full border-blue-200/90 bg-gradient-to-b from-blue-50/40 to-slate-50">
                <div>
                  <div className="sheet-card-header">
                    <MaterialBadge material={matA} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-300 shrink-0">
                          VẬT LIỆU A
                        </span>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block break-words">
                          {stageDetailsA.eyebrow}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-800 break-words leading-tight mt-0.5">
                        {matA.nameVi} · {stageDetailsA.title}
                      </h3>
                      <small className="text-xs text-slate-500 block break-words mt-0.5">
                        {matA.formula} · {matA.categoryLabel}
                      </small>
                    </div>
                  </div>
                  <p className="sheet-copy-p text-slate-600 break-words leading-relaxed">{stageDetailsA.summary}</p>
                </div>

                <div className="space-y-2 mt-3 pt-2.5 border-t border-slate-200/80">
                  <div className="sheet-observation">
                    <Sparkles size={16} className="text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <strong className="text-xs font-bold text-blue-900 block mb-0.5">
                        Đặc điểm quan sát A
                      </strong>
                      <span className="text-xs text-blue-900/85 leading-relaxed block break-words">
                        {stageDetailsA.focus}
                      </span>
                    </div>
                  </div>
                  <div className="sheet-quick-fact flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {stageDetailsA.factLabel}:
                    </span>
                    <strong className="text-xs font-bold text-blue-700 ml-1.5 break-words text-right">
                      {stageDetailsA.fact}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Material B Card */}
              <div className="sheet-card flex flex-col justify-between h-full border-indigo-200/90 bg-gradient-to-b from-indigo-50/40 to-slate-50">
                <div>
                  <div className="sheet-card-header">
                    <MaterialBadge material={matB} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 shrink-0">
                          VẬT LIỆU B
                        </span>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block break-words">
                          {stageDetailsB.eyebrow}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-800 break-words leading-tight mt-0.5">
                        {matB.nameVi} · {stageDetailsB.title}
                      </h3>
                      <small className="text-xs text-slate-500 block break-words mt-0.5">
                        {matB.formula} · {matB.categoryLabel}
                      </small>
                    </div>
                  </div>
                  <p className="sheet-copy-p text-slate-600 break-words leading-relaxed">{stageDetailsB.summary}</p>
                </div>

                <div className="space-y-2 mt-3 pt-2.5 border-t border-slate-200/80">
                  <div className="sheet-observation">
                    <Sparkles size={16} className="text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <strong className="text-xs font-bold text-indigo-900 block mb-0.5">
                        Đặc điểm quan sát B
                      </strong>
                      <span className="text-xs text-indigo-900/85 leading-relaxed block break-words">
                        {stageDetailsB.focus}
                      </span>
                    </div>
                  </div>
                  <div className="sheet-quick-fact flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {stageDetailsB.factLabel}:
                    </span>
                    <strong className="text-xs font-bold text-indigo-700 ml-1.5 break-words text-right">
                      {stageDetailsB.fact}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Single Mode: 2 balanced cards (Identity + Observation & Facts) */
            <div className="sheet-info-grid items-stretch">
              {/* Identity & Lesson copy */}
              <div className="sheet-card flex flex-col justify-between h-full">
                <div>
                  <div className="sheet-card-header">
                    <MaterialBadge material={material} size="md" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block break-words">
                        {stageDetails.eyebrow}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-800 break-words leading-snug">
                        {stageDetails.title}
                      </h3>
                      <small className="text-xs text-slate-500 block break-words">
                        {material.nameVi} ({material.formula}) · {material.categoryLabel}
                      </small>
                    </div>
                  </div>
                  <p className="sheet-copy-p text-slate-600 break-words leading-relaxed">{stageDetails.summary}</p>
                </div>
              </div>

              {/* Scientific Observation & Quick Facts */}
              <div className="sheet-card flex flex-col justify-between h-full">
                <div className="sheet-observation">
                  <Sparkles size={17} className="text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <strong className="text-xs font-bold text-amber-900 block mb-0.5">
                      Gợi ý quan sát
                    </strong>
                    <span className="text-xs text-amber-800/90 leading-relaxed block break-words">
                      {stageDetails.focus}
                    </span>
                  </div>
                </div>

                <div className="sheet-quick-fact mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {stageDetails.factLabel}:
                  </span>
                  <strong className="text-xs font-bold text-blue-700 ml-1.5 break-words text-right">
                    {stageDetails.fact}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Action Hub Buttons */}
          <div className="sheet-actions-row">
            <button
              type="button"
              className="sheet-action-button primary"
              onClick={() => {
                sound.playClick();
                onOpenDetail();
              }}
            >
              <BookOpen size={17} />
              <span>Xem Hồ sơ Khoa học & Liên kết</span>
            </button>

            <button
              type="button"
              className="sheet-action-button"
              onClick={() => {
                sound.playClick();
                onOpenCompare();
              }}
            >
              <Columns2 size={17} />
              <span>Đối chiếu với vật liệu khác</span>
            </button>

            <button
              type="button"
              className={`sheet-action-button ${isDual3DView ? 'is-active' : ''}`}
              onClick={() => {
                sound.playClick();
                onToggleDual3DView();
              }}
            >
              <Box size={17} />
              <span>{isDual3DView ? 'Đang bật Xem kép' : 'Chế độ xem kép 3D'}</span>
            </button>
          </div>
        </div>
      )}
    </section>

    {/* ── Nút khôi phục khi Thanh 1 (Bottom dock) trượt ẩn xuống dưới ── */}
    {isBottomDockHidden && !isZenMode && !isTourActive && (
      <button
        type="button"
        className="bottom-dock-restore-btn"
        onClick={() => {
          sound.playClick();
          setIsBottomDockHidden(false);
        }}
        title="Hiện lại thanh điều hướng cấp độ & công cụ"
        aria-label="Hiện thanh điều hướng"
      >
        <ChevronUp size={15} className="text-blue-600 animate-bounce" />
        <span>Hiện thanh điều hướng</span>
      </button>
    )}
  </>
  );
}
