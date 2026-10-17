'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIALS, MATERIAL_CATEGORIES } from '@/data/materials';
import {
  ChevronLeft,
  Search,
  GitCompare,
  Layers,
  Sparkles,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';

export default function MaterialSelector() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const showSidebar = useStore((s: StoreState) => s.showSidebar);
  const setShowSidebar = useStore((s: StoreState) => s.setShowSidebar);
  const setIsCompareOpen = useStore((s: StoreState) => s.setIsCompareOpen);
  const setCompareMaterialA = useStore((s: StoreState) => s.setCompareMaterialA);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredMaterials = useMemo(() => {
    return MATERIALS.filter((m) => {
      const matchQuery =
        m.nameVi.toLowerCase().includes(search.toLowerCase()) ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.formula.toLowerCase().includes(search.toLowerCase()) ||
        m.objectNameVi.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'all' || m.category === selectedCat;
      return matchQuery && matchCat;
    });
  }, [search, selectedCat]);

  return (
    <>
      {/* Sidebar Panel with Dim Backdrop */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop for click-outside dismissal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-4 left-4 bottom-4 w-92 sm:w-96 max-w-[calc(100vw-2rem)] z-50 overflow-hidden duo-card flex flex-col pointer-events-auto select-none"
            >
              {/* Header */}
              <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-[#121e25]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#58cc02] border-2 border-b-4 border-[#46a302] flex items-center justify-center text-white shadow-md">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-white tracking-wide">
                        Thư viện Vật liệu
                      </h2>
                      <p className="text-xs text-white/50 font-bold">
                        12 cấu trúc PBR & Mạng tinh thể
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setCompareMaterialA(selectedMaterial);
                        setIsCompareOpen(true);
                      }}
                      className="w-8 h-8 duo-pill rounded-xl flex items-center justify-center text-[#1cb0f6]"
                      title="So sánh vật liệu này"
                    >
                      <GitCompare size={16} />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowSidebar(false);
                      }}
                      className="w-8 h-8 duo-pill rounded-xl flex items-center justify-center text-white/70 hover:text-white"
                      title="Thu gọn"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mt-3.5 relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm: Au, Cu, Kim cương, Si..."
                    className="w-full pl-10 pr-3.5 py-2 rounded-2xl bg-[#16242c] border-2 border-[#2b4452] text-xs sm:text-sm font-bold text-white placeholder-white/40 focus:outline-none focus:border-[#58cc02]"
                  />
                </div>

                {/* Category Pills (Chunky Duolingo 3D Buttons) */}
                <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedCat('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 border-2 border-b-3 active:translate-y-0.5 ${
                      selectedCat === 'all'
                        ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm'
                        : 'bg-[#182830] border-[#2b4452] border-b-[#16242c] text-white/60 hover:text-white'
                    }`}
                  >
                    Tất cả ({MATERIALS.length})
                  </button>
                  {MATERIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        sound.playClick();
                        setSelectedCat(cat.key);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 border-2 border-b-3 active:translate-y-0.5 ${
                        selectedCat === cat.key
                          ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm'
                          : 'bg-[#182830] border-[#2b4452] border-b-[#16242c] text-white/60 hover:text-white'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material List (Spacious Chunky Cards) */}
              <div className="flex-1 min-h-0 px-3.5 py-3 overflow-y-auto custom-scrollbar space-y-2">
                {filteredMaterials.length === 0 ? (
                  <div className="text-center py-10 text-xs text-white/40 font-bold">
                    Không tìm thấy vật liệu phù hợp
                  </div>
                ) : (
                  filteredMaterials.map((mat) => {
                    const isSelected = selectedMaterial === mat.id;
                    return (
                      <motion.button
                        key={mat.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedMaterial(mat.id);
                        }}
                        className={`w-full text-left p-3 rounded-2xl transition-all duration-150 group relative border-2 border-b-4 active:translate-y-[2px] active:border-b-2
                          ${
                            isSelected
                              ? 'bg-[#18313d] border-[#1cb0f6] border-b-[#1899d6] shadow-lg shadow-[#1cb0f6]/20'
                              : 'bg-[#14232a] border-[#283e4a] border-b-[#19262e] hover:border-[#3d5e71] hover:bg-[#1a2c35]'
                          }`}
                        whileHover={{ scale: 1.01 }}
                        layout
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e313b] border-2 border-white/10 shrink-0 shadow-sm">
                            {mat.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs sm:text-sm font-extrabold truncate ${
                                  isSelected ? 'text-[#1cb0f6]' : 'text-white'
                                }`}
                              >
                                {mat.nameVi}
                              </span>
                              <span className="text-[10px] text-[#1cb0f6] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[#1cb0f6]/20 border border-[#1cb0f6]/30">
                                {mat.formula}
                              </span>
                            </div>
                            <div className="text-[11px] text-white/50 font-medium truncate mt-0.5">
                              {mat.objectNameVi} • {mat.categoryLabel}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-3 h-3 rounded-full bg-[#58cc02] shadow-[0_0_8px_#58cc02] shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Footer Summary */}
              <div className="px-5 py-3 border-t border-white/10 bg-[#121e25] text-xs text-white/50 flex items-center justify-between font-bold">
                <span>12 cấu trúc tinh thể đa thang đo</span>
                <Layers size={14} className="text-[#58cc02]" />
              </div>
            </motion.div>

        </>
      )}
    </AnimatePresence>
  </>
);
}
