import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, Zap, Maximize, Minimize2, Crop, RotateCw, FlipHorizontal, Share2, FilePlus, FileMinus, FileImage, FileStack, ArrowUpDown, Minimize, Image, FileCode, Smartphone, FileText, Table, Code, Binary, Link as LinkIcon, Palette, FileDiff, Pipette, Globe, Type, Braces, Code2, FileJson, Settings, Database, Layout } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { TOOLS, ToolCategory } from '../context/AppContext';

const ICON_MAP: Record<string, any> = {
  Maximize, Minimize2, Crop, RotateCw, FlipHorizontal, Share2, FilePlus, FileMinus, FileImage, FileStack, ArrowUpDown, Minimize, Image, FileCode, Smartphone, FileText, Table, Code, Binary, Link: LinkIcon, Palette, FileDiff, Pipette, Globe, Type, Braces, Code2, FileJson, Settings, Database, Search, Zap, Layout
};

export default function ToolsDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ToolCategory | 'all' | null;
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(categoryParam || 'all');

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      searchParams.set('q', val.trim());
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (catId: ToolCategory | 'all') => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName] || Zap;
    return <Icon size={24} />;
  };

  const categories: { id: ToolCategory | 'all', name: string }[] = [
    { id: 'all', name: 'All Tools' },
    { id: 'image', name: 'Image' },
    { id: 'pdf', name: 'PDF' },
    { id: 'developer', name: 'Developer' },
    { id: 'creator', name: 'Creator' },
    { id: 'converter', name: 'Converters' },
    { id: 'editor', name: 'Editors' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Tools Directory</h1>
        <p className="text-white/60 text-lg">Browse our collection of fast, browser-based tools.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'glass hover:bg-white/10 text-white/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full glass rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={tool.path}
              className="group glass p-6 rounded-3xl block glass-hover h-full flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {getIcon(tool.icon)}
              </div>
              <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                Open Tool <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl">
          <p className="text-white/40">No tools found matching your search.</p>
        </div>
      )}
    </div>
  );
}
