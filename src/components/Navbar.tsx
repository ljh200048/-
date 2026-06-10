import { useState } from 'react';
import { Sparkles, Moon, Menu, X, Landmark, Heart, ClipboardList, HelpCircle, Shield, Key } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
}

export default function Navbar({ currentTab, onChangeTab, isAdminLoggedIn, onLogoutAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: '홈', icon: Moon },
    { id: 'today', label: '오늘의 운세', icon: Sparkles },
    { id: 'tarot', label: '타로 뽑기', icon: Heart },
    { id: 'products', label: '하루 사주/타로 상품', icon: Landmark },
    { id: 'booking', label: '상담 예약', icon: ClipboardList },
    { id: 'reviews', label: '후기', icon: HelpCircle },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'policies', label: '정책 안내', icon: Shield },
    { id: 'admin', label: '관리자 페이지', icon: Key },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#070B19]/90 backdrop-blur-md border-b border-purple-900/40 px-4 py-3" id="navbar_container">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => { onChangeTab('home'); setIsOpen(false); }}
          id="navbar_logo"
        >
          <div className="relative">
            <Moon className="w-7 h-7 text-amber-300 fill-amber-300/20 group-hover:rotate-12 transition-transform duration-500" />
            <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-xl font-sans font-bold tracking-wider text-ivory text-amber-50">
            하루운세
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1" id="navbar_desktop_menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                currentTab === item.id
                  ? 'text-amber-200 bg-purple-950/40 border border-amber-500/30 font-semibold shadow-[0_0_12px_rgba(234,179,8,0.15)]'
                  : 'text-gray-300 hover:text-amber-100 hover:bg-purple-900/20'
              }`}
              id={`nav_btn_${item.id}`}
            >
              {item.label}
            </button>
          ))}
          {isAdminLoggedIn && (
            <button
              onClick={onLogoutAdmin}
              className="ml-4 px-3 py-1.5 rounded bg-red-950/40 border border-red-800 text-xs text-red-200 hover:bg-red-900/50 transition-all"
              id="nav_btn_logout"
            >
              관리자 로그아웃
            </button>
          )}
        </div>

        {/* Mobile Hamburger Burger */}
        <button 
          className="lg:hidden p-2 text-gray-300 hover:text-amber-200"
          onClick={() => setIsOpen(!isOpen)}
          id="navbar_hamburger"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-3 pt-2 pb-4 border-t border-purple-950 flex flex-col space-y-1" id="navbar_mobile_drawer">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                  currentTab === item.id
                    ? 'text-amber-200 bg-purple-950/60 border-l-4 border-amber-400'
                    : 'text-gray-300 hover:text-amber-100 hover:bg-purple-950/30'
                }`}
                id={`nav_mob_btn_${item.id}`}
              >
                <IconComponent className="w-5 h-5 text-purple-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {isAdminLoggedIn && (
            <button
              onClick={() => {
                onLogoutAdmin();
                setIsOpen(false);
              }}
              className="mt-4 mx-4 py-2 rounded bg-red-950/40 border border-red-800 text-sm text-red-200 text-center"
              id="nav_mob_btn_logout"
            >
              관리자 로그아웃
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
