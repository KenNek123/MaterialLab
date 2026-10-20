'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GraduationCap,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Database,
  Atom,
  BookOpen,
  Sparkles,
  Layers,
  Code2,
  ShieldCheck,
  Search,
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  FileText,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';
import { MATERIAL_CITATIONS, MATERIAL_CITATIONS_MAP, MaterialCitationEntry } from '@/data/materialCitations';
import { MATERIALS, MATERIAL_MAP } from '@/data/materials';
import MaterialBadge from '@/components/ui/MaterialBadge';
import { useStore, StoreState } from '@/store/useStore';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'citations'>('overview');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);

  const teacherEmail = 'nguyenvantaitriet@gmail.com';
  const teacherName = 'Nguyễn Văn Tài';

  const handleCopyEmail = () => {
    sound.playClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(teacherEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSelectMaterial = (id: string) => {
    sound.playClick();
    setSelectedMaterialId(id);
  };

  const handleBackToList = () => {
    sound.playClick();
    setSelectedMaterialId(null);
  };

  const handleJumpTo3D = (matId: string) => {
    sound.playClick();
    setSelectedMaterial(matId);
    onClose();
  };

  // Filtered materials for citations directory
  const filteredCitations = useMemo(() => {
    return MATERIAL_CITATIONS.filter((entry) => {
      const mat = MATERIAL_MAP.get(entry.materialId);
      const matchesCategory =
        selectedCategory === 'all' || (mat && mat.category === selectedCategory);
      const matchesSearch =
        searchQuery.trim() === '' ||
        entry.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.latticeType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeCitationEntry = selectedMaterialId
    ? MATERIAL_CITATIONS_MAP.get(selectedMaterialId)
    : null;
  const activeMaterialData = selectedMaterialId
    ? MATERIAL_MAP.get(selectedMaterialId)
    : null;

  const dataSources = [
    {
      title: 'The Materials Project',
      org: 'Bộ Năng Lượng Hoa Kỳ (U.S. Dept of Energy / LBNL)',
      link: 'https://next-gen.materialsproject.org',
      desc: 'Cơ sở dữ liệu thông số ô mạng (Lattice constants a, b, c, α, β, γ), năng lượng hình thành tính toán DFT, hệ tinh thể và cấu trúc vùng năng lượng.',
      badge: 'Tinh thể học & DFT',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Crystallography Open Database (COD)',
      org: 'Cộng đồng Tinh thể học Quốc tế mở',
      link: 'https://www.crystallography.net/cod/',
      desc: 'Kho lưu trữ dữ liệu tinh thể học mở toàn cầu, cung cấp tọa độ mạng nguyên tử 3D (CIF - Crystallographic Information File) và nhóm không gian đối xứng (Space Group).',
      badge: 'CIF & Space Groups',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'NIST Chemistry WebBook & PubChem',
      org: 'Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ (NIST) & NIH/NCBI',
      link: 'https://webbook.nist.gov/chemistry/',
      desc: 'Năng lượng liên kết hóa học cốt lõi (kJ/mol), độ dài liên kết phân tử (Å), góc liên kết, nhiệt động học phản ứng và phân loại hóa học phân tử.',
      badge: 'Liên kết & Năng lượng',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'CRC Handbook of Chemistry and Physics & ASM International',
      org: 'CRC Press & Hiệp hội Vật liệu Quốc tế ASM',
      link: 'https://hbcp.chemnetbase.com',
      desc: 'Hệ thống định lượng chuẩn hóa: Thang độ cứng Mohs, Khối lượng riêng (g/cm³), Điểm nóng chảy (°C), Độ dẫn điện (S/m), Độ dẫn nhiệt (W/m·K) và đặc tính chống ăn mòn.',
      badge: 'Chỉ số Cơ - Lý - Hóa',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'IUPAC Compendium of Chemical Terminology (Gold Book)',
      org: 'Liên minh Quốc tế về Hóa học Thuần túy và Ứng dụng (IUPAC)',
      link: 'https://goldbook.iupac.org',
      desc: 'Quy chuẩn danh pháp hóa học quốc tế, cấu hình electron, bán kính nguyên tử (pm), độ âm điện thang Pauling và hình học phối trí.',
      badge: 'Quy chuẩn Quốc tế',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: 'Nature Materials, ACS Nano & Science Direct',
      org: 'Các ấn phẩm khoa học vật liệu tiên tiến hàng đầu',
      link: 'https://www.nature.com/nmat/',
      desc: 'Nguồn nghiên cứu cập nhật cho các vật liệu thế hệ mới: Graphene, MXene 2D, Ống nano carbon (SWCNT), Perovskite quang điện, Silica Aerogel và hợp kim nhớ hình Nitinol.',
      badge: 'Vật liệu Mới & Nano',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-[94%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-4xl max-h-[min(90dvh,92%)] flex flex-col overflow-hidden z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-900/20 border-2 border-blue-200/90"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
          >
            {/* Top Candy Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 z-10" />

            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/70 flex items-center justify-between shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Atom size={22} className="animate-spin-slow" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 id="about-modal-title" className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Giới thiệu & Nguồn Khoa Học
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 hidden xs:inline">
                      About Us
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Digital Materials Lab · Phòng Thí Nghiệm Vật Liệu Số Tương Tác 3D
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
                title="Đóng bảng giới thiệu"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('overview');
                  setSelectedMaterialId(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <BookOpen size={14} className={activeTab === 'overview' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Tổng quan & Tác giả</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('citations');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'citations'
                    ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Database size={14} className={activeTab === 'citations' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Trích dẫn theo Vật liệu</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-extrabold">
                  {MATERIAL_CITATIONS.length}
                </span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar bg-slate-50/50">
              {activeTab === 'overview' ? (
                <>
                  {/* ── Section 1: Teacher & Author Profile Card ── */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/90 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                          <GraduationCap size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 font-extrabold block">
                            Giáo viên & Tác giả dự án
                          </span>
                          <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                            {teacherName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Giảng dạy & Nghiên cứu Khoa học Tinh thể & Vật liệu Số
                          </p>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                          title="Sao chép địa chỉ email vào bộ nhớ tạm"
                        >
                          {copied ? (
                            <>
                              <Check size={14} className="text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Đã sao chép!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} className="text-slate-500" />
                              <span>Sao chép Email</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`mailto:${teacherEmail}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm shadow-blue-500/20"
                          title="Gửi thư trực tiếp"
                        >
                          <Mail size={14} />
                          <span>{teacherEmail}</span>
                        </a>
                      </div>
                    </div>

                    {/* Mission statement */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed break-words">
                      <p>
                        Dự án <strong>Digital Materials Lab</strong> được xây dựng nhằm mục tiêu hiện đại hóa công tác
                        giảng dạy và học tập bộ môn Hóa học Tinh thể và Khoa học Vật liệu. Nền tảng kết nối trực quan
                        thế giới vĩ mô quen thuộc trong đời sống với chiều sâu cấu trúc vi mô của ô mạng cơ sở và liên kết
                        nguyên tử lượng tử 3 chiều.
                      </p>
                    </div>
                  </div>

                  {/* ── Feature Banner: Interactive Material Citations Directory ── */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('citations');
                    }}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 text-white shadow-lg shadow-blue-600/25 cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                          <BookmarkCheck size={24} className="text-sky-200" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 font-bold">
                              Nguồn Thật 100%
                            </span>
                            <span className="text-[10px] font-mono text-sky-200">
                              {MATERIAL_CITATIONS.length} Vật liệu đầy đủ
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-black tracking-tight mt-1">
                            Tra Cứu Nguồn Trích Dẫn & Cơ Sở Dữ Liệu Từng Vật Liệu
                          </h4>
                          <p className="text-xs text-sky-100/90 mt-0.5 line-clamp-1">
                            Xem trực tiếp mã The Materials Project, COD CIF, NIST WebBook, bài báo gốc và link truy cập nhanh.
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-blue-700 font-black text-xs shrink-0 group-hover:translate-x-1 transition-transform shadow-sm">
                        <span>Khám phá ngay</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>

                  {/* ── Section 2: 3-Stage Multi-Scale Learning Model ── */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-blue-600" />
                      <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-700">
                        MÔ HÌNH HỌC TẬP ĐA TẦNG (MULTI-SCALE PARADIGM)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-blue-600 block">
                          CẤP ĐỘ 1 (VĨ MÔ)
                        </span>
                        <strong className="text-slate-900 block text-xs">Vật thể đời sống thực tế</strong>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Quan sát ứng dụng thực tế: viên kim cương, thỏi vàng, cánh máy bay, chip bán dẫn.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 block">
                          CẤP ĐỘ 2 (Ô MẠNG)
                        </span>
                        <strong className="text-slate-900 block text-xs">Mạng tinh thể tuần hoàn</strong>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Phân tích hệ tinh thể (Lập phương tâm mặt, Lục giác, Tứ diện), khung lồng Bravais và mặt phẳng Miller.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-emerald-600 block">
                          CẤP ĐỘ 3 (NGUYÊN TỬ)
                        </span>
                        <strong className="text-slate-900 block text-xs">Liên kết & Tương tác hạt</strong>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Soi cận cảnh tương tác hạt: Độ dài liên kết (Å), góc liên kết (°), độ âm điện và hình học lai hóa orbital.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Section 2.5: High School GDPT 2018 Curriculum Integration ── */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-400" />
                        <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-sky-200">
                          BÁM SÁT CHƯƠNG TRÌNH GDPT 2018 (THPT LỚP 10 - 11 - 12)
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        Chuẩn Sách Giáo Khoa
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-sky-300 font-mono block">
                          🧪 HÓA HỌC 10 & 11
                        </span>
                        <strong className="text-white text-[11px] block">Liên kết hóa học & Tinh thể</strong>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Chuyên đề tinh thể học: Mạng kim cương, Than chì, Silic, Tinh thể kim loại (Vàng, Đồng, Nhôm), Phối trí ion và liên kết cộng hóa trị định hướng.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-amber-300 font-mono block">
                          ⚙️ CÔNG NGHỆ 11 (CƠ KHÍ)
                        </span>
                        <strong className="text-white text-[11px] block">Vật liệu cơ khí chế tạo</strong>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Thép carbon C45 (bánh răng, trục then), Thép không gỉ Inox 304, Hợp kim nhôm Duralumin 2024, Hợp kim cứng Vonfram Cacbua (WC dao tiện CNC) và Nitinol y tế.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-purple-300 font-mono block">
                          ⚡ VẬT LÝ 10 & 11
                        </span>
                        <strong className="text-white text-[11px] block">Chất rắn & Cơ tính vật liệu</strong>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Phân biệt chất rắn kết tinh và vô định hình, độ dẫn nhiệt, dẫn điện của biển electron kim loại, ứng suất cơ học và biến dạng đàn hồi mạng tinh thể.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-300 font-mono block">
                          🚀 HÓA HỌC 12 & NANO
                        </span>
                        <strong className="text-white text-[11px] block">Polyme & Vật liệu thế hệ mới</strong>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Polyme mạch xoắn Teflon, Cao su lưu hóa cầu nối –S–S–, Sợi Kevlar chống đạn, Vật liệu 2D MXene và Pin Lithium-ion Nobel Hóa học 2019.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Section 3: Data Sources & Scientific References ── */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-blue-600" />
                        <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-700">
                          6 TRỤ CỘT CƠ SỞ DỮ LIỆU KHOA HỌC CHUẨN HÓA
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Quy chuẩn quốc tế
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dataSources.map((source, idx) => (
                        <div
                          key={`source-${idx}`}
                          className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 transition-colors shadow-xs flex flex-col justify-between h-full space-y-2.5"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${source.badgeColor}`}>
                                {source.badge}
                              </span>
                              <a
                                href={source.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                                title={`Truy cập ${source.title}`}
                                aria-label={`Truy cập ${source.title}`}
                              >
                                <ExternalLink size={13} />
                              </a>
                            </div>
                            <h5 className="text-xs sm:text-[13px] font-black text-slate-900 leading-snug">
                              {source.title}
                            </h5>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                              {source.org}
                            </span>
                            <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5 break-words">
                              {source.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">Dữ liệu đối chiếu</span>
                            <span className="font-bold text-blue-600">Chuẩn hóa quốc tế</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Section 4: Technology & Development Stack ── */}
                  <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-800">
                        Công nghệ nền tảng:
                      </span>
                      <span className="text-slate-600">
                        Next.js · React Three Fiber · Three.js · WebGL 2.0 · TailwindCSS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] shrink-0">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Phiên bản 2026.1 Edu</span>
                    </div>
                  </div>
                </>
              ) : selectedMaterialId && activeCitationEntry ? (
                /* ── Material Specific Citation Dossier Window ── */
                <motion.div
                  key="citation-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Back Navigation Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleBackToList}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>Quay lại danh mục ({MATERIAL_CITATIONS.length} vật liệu)</span>
                    </button>

                    {activeMaterialData && (
                      <button
                        type="button"
                        onClick={() => handleJumpTo3D(activeCitationEntry.materialId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                        title="Mở mô hình 3D vật liệu này"
                      >
                        <Box size={14} />
                        <span>Xem mô hình 3D</span>
                      </button>
                    )}
                  </div>

                  {/* Material Identity Header */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/90 shadow-sm space-y-3">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {activeMaterialData && (
                          <MaterialBadge material={activeMaterialData} size="md" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                              {activeCitationEntry.nameVi}
                            </h3>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {activeCitationEntry.formula}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {activeCitationEntry.categoryLabel} · Hệ tinh thể: {activeCitationEntry.latticeType}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                          Nhóm Không Gian
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-700 block mt-0.5">
                          {activeCitationEntry.spaceGroup}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      {activeCitationEntry.summary}
                    </p>
                  </div>

                  {/* Sources List for This Material */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText size={15} className="text-blue-600" />
                        <span>HỒ SƠ NGUỒN TRÍCH DẪN XÁC THỰC ({activeCitationEntry.sources.length} NGUỒN)</span>
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Đã kiểm chứng 100%</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activeCitationEntry.sources.map((src, idx) => (
                        <div
                          key={`src-${idx}`}
                          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-blue-300 transition-all space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${src.typeColor}`}>
                                {src.typeLabel}
                              </span>
                              <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                                {src.sourceName}
                              </h5>
                            </div>

                            {/* Small Quick Access Link Button */}
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-all shadow-2xs hover:scale-[1.02] cursor-pointer self-start sm:self-auto shrink-0"
                              title={`Mở liên kết nguồn trích dẫn: ${src.sourceName}`}
                            >
                              <span>Truy cập nguồn</span>
                              <ExternalLink size={12} className="shrink-0" />
                            </a>
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium">
                            Đơn vị / Cơ quan xuất bản: <strong className="text-slate-700">{src.provider}</strong>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed break-words bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            {src.citationDetail}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400 font-mono">Dữ liệu đối chiếu:</span>
                            {src.verifiedFields.map((field, fIdx) => (
                              <span
                                key={`field-${fIdx}`}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ── 22 Materials Citation Index Directory ── */
                <motion.div
                  key="citation-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Search and Category Filters */}
                  <div className="space-y-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm vật liệu (VD: Kim Cương, Vàng, Graphene, Si, Ti₃C₂Tₓ)..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCategory === 'all'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Tất cả ({MATERIAL_CITATIONS.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('metal')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCategory === 'metal'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Kim loại & Hợp kim
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('crystal')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCategory === 'crystal'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Gốm & Tinh thể
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('nano')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCategory === 'nano'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Vật liệu Nano
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('molecular')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCategory === 'molecular'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Cấu trúc Phân tử
                      </button>
                    </div>
                  </div>

                  {/* Materials Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredCitations.map((entry) => {
                      const mat = MATERIAL_MAP.get(entry.materialId);
                      return (
                        <div
                          key={`citation-card-${entry.materialId}`}
                          onClick={() => handleSelectMaterial(entry.materialId)}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                {mat && <MaterialBadge material={mat} size="sm" />}
                                <div className="min-w-0">
                                  <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                    {entry.nameVi}
                                  </h5>
                                  <span className="text-[10px] font-mono text-slate-500 block truncate">
                                    {entry.formula} · {entry.categoryLabel}
                                  </span>
                                </div>
                              </div>

                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0 whitespace-nowrap">
                                {entry.sources.length} nguồn CSDL
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                              {entry.summary}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="font-mono text-slate-400 truncate max-w-[170px]">
                              {entry.spaceGroup}
                            </span>
                            <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                              <span>Xem nguồn</span>
                              <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredCitations.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Không tìm thấy vật liệu phù hợp với từ khóa &quot;{searchQuery}&quot;
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-slate-500 truncate">
                © 2026 Digital Materials Lab · Dự án giáo dục của <strong>{teacherName}</strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-blue-500/20 min-h-[40px] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
