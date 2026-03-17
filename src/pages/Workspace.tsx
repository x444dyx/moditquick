import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Clock, 
  Star, 
  Settings, 
  ChevronRight,
  Zap,
  Image as ImageIcon,
  FileText,
  Code,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../context/AppContext';

export default function Workspace() {
  const recentTools = TOOLS.slice(0, 4);
  const categories = [
    { id: 'image', name: 'Image Tools', icon: ImageIcon, count: 5, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'pdf', name: 'PDF Tools', icon: FileText, count: 2, color: 'text-red-400', bg: 'bg-red-400/10' },
    { id: 'developer', name: 'Developer Tools', icon: Code, count: 3, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="p-8 space-y-12">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Creator</h1>
          <p className="text-white/40">What would you like to build today?</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="glass p-2.5 rounded-xl hover:bg-white/10 transition-colors">
            <Settings size={20} className="text-white/60" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light p-[2px]">
            <div className="w-full h-full rounded-full bg-[#07101F] flex items-center justify-center">
              <span className="text-xs font-bold">AZ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/tools?category=${cat.id}`}
            className="glass p-6 rounded-[32px] space-y-4 group cursor-pointer glass-hover block"
          >
            <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color}`}>
              <cat.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-white/40 text-sm">{cat.count} tools available</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View Category <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Tools */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-white/60">
            <Clock size={18} />
            <h2 className="font-semibold">Recently Used</h2>
          </div>
          <Link to="/tools" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="glass p-5 rounded-3xl space-y-4 group glass-hover"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap size={20} className="text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-bold">{tool.name}</h4>
                <p className="text-xs text-white/30 mt-1 line-clamp-1">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Tool / Banner */}
      <div className="glass rounded-[40px] p-12 bg-gradient-to-br from-primary/20 to-transparent border-primary/20 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            Featured
          </div>
          <h2 className="text-4xl font-bold">New: SVG to PNG Converter</h2>
          <p className="text-white/60 text-lg leading-relaxed">
            High-fidelity SVG rendering with custom resolution support. 
            Perfect for developers and designers.
          </p>
          <button className="btn-primary flex items-center gap-2">
            Try it now <ArrowRight size={18} />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <Zap className="absolute -right-12 -bottom-12 w-64 h-64 text-primary/5 rotate-12" />
      </div>
    </div>
  );
}
