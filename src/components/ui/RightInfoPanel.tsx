'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
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
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);

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

  return (
    <aside
      className={`lesson-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
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
          <button
            className="lesson-pill-toggle"
            onClick={() => setIsExpanded((prev) => !prev)}
            type="button"
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Full Content (Desktop card view / Mobile expanded) */}
      <div className="lesson-full-content">
        <div className="lesson-identity">
          <MaterialBadge material={material} size="lg" showSub />
          <div>
            <span>{material.categoryLabel}</span>
            <h2>{material.nameVi}</h2>
            <small>
              {material.formula} · {material.name}
            </small>
          </div>
          <button
            className="lesson-mobile-close"
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
  );
}
