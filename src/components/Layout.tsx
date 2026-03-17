import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Wrench, 
  Search, 
  LayoutGrid, 
  Image as ImageIcon, 
  FileText, 
  Code, 
  Pipette, 
  ArrowLeftRight,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Tools', path: '/tools', icon: Wrench },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(new URLSearchParams(location.search).get('q') || '');

  React.useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get('q') || '');
  }, [location.search]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      navigate(`/tools?q=${encodeURIComponent(val.trim())}`, { replace: location.pathname === '/tools' });
    } else if (location.pathname === '/tools') {
      navigate('/tools', { replace: true });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchChange(searchQuery);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/tools?category=${categoryId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="ModitQuick Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-xl font-bold tracking-tight">Modit<span className="text-primary">Quick</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-primary' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-64 transition-all"
              />
            </form>
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/logo.png" alt="ModitQuick Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="text-lg font-bold tracking-tight">Modit<span className="text-primary">Quick</span></span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Fast, private browser tools for files, PDFs, images, and code.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Browse</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link to="/tools" className="hover:text-primary transition-colors">All Tools</Link></li>
              <li><button onClick={() => handleCategoryClick('image')} className="hover:text-primary transition-colors">Image</button></li>
              <li><button onClick={() => handleCategoryClick('pdf')} className="hover:text-primary transition-colors">PDF</button></li>
              <li><button onClick={() => handleCategoryClick('developer')} className="hover:text-primary transition-colors">Developer</button></li>
              <li><button onClick={() => handleCategoryClick('creator')} className="hover:text-primary transition-colors">Creator</button></li>
              <li><button onClick={() => handleCategoryClick('converter')} className="hover:text-primary transition-colors">Converters</button></li>
              <li><button onClick={() => handleCategoryClick('editor')} className="hover:text-primary transition-colors">Editors</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Connect</h4>
            <div className="flex items-center gap-4">
              <a 
                href="https://x.com/moditquick" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="ModitQuick on X"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <div>© 2026 ModitQuick. All rights reserved.</div>
          <div>
            A product by <a href="https://www.ayteelabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">AyTee Labs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
