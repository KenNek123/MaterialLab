'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { MaterialData, StoreState, useStore, ZoomLayer } from '@/store/useStore';
import { sound } from '@/lib/soundFx';
import MaterialBadge from './MaterialBadge';

interface RightInfoPanelProps {
  material: MaterialData;
  activeStage: {
    id: ZoomLayer;
    label: string;
    shortLabel: string;
    caption: string;
    scale: string;
  };
}

export default function RightInfoPanel({ material, activeStage }: RightInfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const isZenMode = useStore((s: StoreState) => s.isZenMode);
  const isMaterialCardVisible = useStore((s: StoreState) => s.isMaterialCardVisible);
  const setIsMaterialCardVisible = useStore((s: StoreState) => s.setIsMaterialCardVisible);

  const lesson = useMemo(() => {
    if (activeLayer === 'micro') {
      return {
        eyebrow: 'Cấp độ 2 · Ô mạng cơ sở',
        title: 'Bên trong mạng tinh thể',
        summary: `Các nguyên tử tuần hoàn tạo thành ${material.molecularInfo.latticeType.toLocaleLowerCase('vi')}.`,
        focusLabel: 'Quan sát ô mạng',
        focus: 'Cách các hạt sắp xếp lặp lại trong không gian 3 chiều tạo nên cấu trúc bền vững.',
        factLabel: 'Hệ tinh thể',
        fact: material.molecularInfo.crystalSystem,
      };
    }
    if (activeLayer === 'molecular') {
      return {
        eyebrow: 'Cấp độ 3 · Cấp độ nguyên tử',
        title: 'Liên kết & Tương tác hạt',
        summary: `Mạng liên kết bền vững được giữ bởi ${material.molecularInfo.bonds.type.toLocaleLowerCase('vi')}.`,
        focusLabel: 'Tương tác nguyên tử',
        focus: 'Chạm vào bất kỳ quả cầu nguyên tử nào để mở bảng hồ sơ khoa học chi tiết.',
        factLabel: 'Độ dài liên kết',
        fact: material.molecularInfo.bondLength,
      };
    }
    return {
      eyebrow: 'Cấp độ 1 · Vật liệu công nghệ mới',
      title: material.objectNameVi,
      summary: `${material.nameVi} thuộc phân loại ${material.categoryLabel}, ứng dụng đột phá trong khoa học công nghệ nhờ các đặc tính cơ lý vượt trội.`,
      focusLabel: 'Khám phá vật liệu',
      focus: 'Xoay vật thể để quan sát hình dạng 3D, sau đó bấm chuyển nấc Ô mạng để nhìn sâu vào cấu trúc bên trong.',
      factLabel: 'Ứng dụng tiêu biểu',
      fact: material.macroInfo.applications[0],
    };
  }, [activeLayer, material]);

  if (isZenMode) return null;

  return (
    <>
      {/* Reopen Floating Chip when dismissed (Requirement 4) */}
      {!isMaterialCardVisible && (
        <button
          type="button"
          className="material-card-reopen-tab"
          onClick={() => {
            sound.playClick();
            setIsMaterialCardVisible(true);
          }}
          title="Mở lại thẻ thông tin vật liệu"
          aria-label="Mở thẻ vật liệu"
        >
          <MaterialBadge material={material} size="sm" />
          <span className="reopen-tab-title">{material.nameVi}</span>
          <ChevronDown size={15} className="text-sky-600 shrink-0" />
        </button>
      )}

      {/* Desktop Collapsed Floating Tab (Directional Chevron points LEFT into screen - Requirement 5) */}
      {isMaterialCardVisible && isDesktopCollapsed && (
        <button
          type="button"
          className="desktop-panel-expand-pill"
          onClick={() => {
            sound.playClick();
            setIsDesktopCollapsed(false);
          }}
          title="Mở rộng bảng thông tin bài học"
          aria-label="Mở bài học"
        >
          <ChevronLeft size={16} />
          <span>Bài học</span>
        </button>
      )}

      {isMaterialCardVisible && (
        <aside
          className={`lesson-card ${isExpanded ? 'is-expanded' : 'is-collapsed'} ${
            isDesktopCollapsed ? 'is-desktop-collapsed' : ''
          }`}
          aria-live="polite"
          aria-label="Thông tin bài học vật liệu"
        >
          {/* Mobile Bar View */}
          <div
            className="lesson-mobile-bar"
            onClick={() => setIsExpanded((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
          >
            <MaterialBadge material={material} size="sm" />
            <div className="lesson-mobile-titles">
              <div className="lesson-mobile-row">
                <strong>{material.nameVi}</strong>
                <span className="lesson-mobile-stage-badge">{activeStage.shortLabel}</span>
              </div>
              <span className="lesson-mobile-sub truncate">{lesson.title}</span>
            </div>
            <div className="lesson-mobile-buttons" onClick={(e) => e.stopPropagation()}>
              <button
                className="lesson-pill-action"
                onClick={() => {
                  sound.playClick();
                  setIsDetailOpen(true);
                }}
                type="button"
                title="Xem chi tiết toàn diện"
              >
                <BookOpen size={14} />
                <span>Chi tiết</span>
              </button>

              {/* Close X button right on collapsed mobile card (Requirement 4) */}
              <button
                className="lesson-pill-close"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setIsMaterialCardVisible(false);
                }}
                type="button"
                title="Tắt thẻ thông tin vật liệu"
                aria-label="Đóng thẻ"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Center-aligned border toggle with directional chevron for mobile (Requirement 5) */}
          {/* Collapsed = points DOWN (open down); Expanded = points UP (close up) */}
          <button
            type="button"
            className="center-border-toggle lg:hidden"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setIsExpanded((prev) => !prev);
            }}
            title={isExpanded ? 'Thu gọn thẻ lên trên' : 'Mở rộng thẻ xuống dưới'}
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-sky-600" />
            ) : (
              <ChevronDown size={16} className="text-sky-600" />
            )}
          </button>

          {/* Full Content (Desktop card view / Mobile expanded) */}
          <div className="lesson-full-content">
            <div className="lesson-identity">
              <MaterialBadge material={material} size="lg" showSub />
              <div className="min-w-0 flex-1">
                <span>{material.categoryLabel}</span>
                <h2>{material.nameVi}</h2>
                <small>
                  {material.formula} · {material.name}
                </small>
              </div>
              {/* Desktop Collapse Button - Chevron points RIGHT to close towards edge (Requirement 5) */}
              <button
                className="desktop-collapse-btn hidden lg:flex"
                onClick={() => {
                  sound.playClick();
                  setIsDesktopCollapsed(true);
                }}
                type="button"
                title="Thu gọn bảng về lề phải"
                aria-label="Thu gọn bài học"
              >
                <ChevronRight size={16} />
              </button>
              {/* Mobile Close Button */}
              <button
                className="lesson-mobile-close lg:hidden"
                onClick={() => setIsExpanded(false)}
                type="button"
                title="Thu gọn bài học"
              >
                <ChevronUp size={18} />
              </button>
            </div>

          <div className="lesson-copy">
            <span className="lesson-eyebrow">{lesson.eyebrow}</span>
            <h3>{lesson.title}</h3>
            <p>{lesson.summary}</p>
          </div>

          <div className="observation-prompt">
            <Sparkles size={17} />
            <div>
              <strong>{lesson.focusLabel}</strong>
              <span>{lesson.focus}</span>
            </div>
          </div>

          <div className="quick-fact">
            <span>{lesson.factLabel}</span>
            <strong>{lesson.fact}</strong>
          </div>

          {/* Single clean detail button */}
          <button
            className="more-button"
            onClick={() => {
              sound.playClick();
              setIsDetailOpen(true);
            }}
            type="button"
          >
            <BookOpen size={17} />
            <span>Hồ sơ chi tiết vật liệu</span>
          </button>
        </div>
      </aside>
    )}
  </>
);
}

