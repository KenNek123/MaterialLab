'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIALS, MATERIAL_CATEGORIES } from '@/data/materials';
import {
  ChevronLeft,
  Search,
  GitCompare,
  Sparkles,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';
import MaterialBadge from '@/components/ui/MaterialBadge';

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
                    <div className="w-10 h-10 rounded-2xl bg-[#1cb0f6] border-2 border-b-4 border-[#0284c7] flex items-center justify-center text-white shadow-md">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-white tracking-wide">
                        Digital Materials Lab
                      </h2>
                      <p className="text-xs text-sky-400 font-bold">
                        GVHD: Nguyễn Văn Tài
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
                      type="button"
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
                      type="button"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mt-3 relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, công thức..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedCat('all');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                      selectedCat === 'all'
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    type="button"
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                        selectedCat === cat.key
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      type="button"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                {filteredMaterials.map((mat) => {
                  const isSelected = mat.id === selectedMaterial;
                  return (
                    <button
                      key={`sidebar-mat-${mat.id}`}
                      onClick={() => {
                        sound.playClick();
                        setSelectedMaterial(mat.id);
                        setShowSidebar(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-400/60 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
                      }`}
                      type="button"
                    >
                      <MaterialBadge material={mat} size="md" showSub />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <strong className="text-xs text-white truncate">{mat.nameVi}</strong>
                          <span className="font-mono text-[10px] text-sky-400 font-bold shrink-0">
                            {mat.formula}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                          {mat.objectNameVi}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
