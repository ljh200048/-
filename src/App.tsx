import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import TodayFortuneView from './components/TodayFortuneView';
import TarotView from './components/TarotView';
import ProductListView from './components/ProductListView';
import ReservationFormView from './components/ReservationFormView';
import ReviewsView from './components/ReviewsView';
import FaqView from './components/FaqView';
import PoliciesView from './components/PoliciesView';
import AdminView from './components/AdminView';
import { Moon, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    document.title = '하루운세';
  }, []);

  const handleSelectProduct = (productName: string) => {
    setSelectedProduct(productName);
    setCurrentTab('booking');
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    if (currentTab === 'admin') {
      setCurrentTab('home');
    }
  };

  // Render proper sub-view based on currentTab state
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView onChangeTab={setCurrentTab} onSelectProduct={handleSelectProduct} />;
      case 'today':
        return <TodayFortuneView />;
      case 'tarot':
        return <TarotView />;
      case 'products':
        return <ProductListView onSelectProduct={handleSelectProduct} />;
      case 'booking':
        return (
          <ReservationFormView 
            selectedProduct={selectedProduct} 
            onSelectProduct={setSelectedProduct} 
          />
        );
      case 'reviews':
        return <ReviewsView />;
      case 'faq':
        return <FaqView />;
      case 'policies':
        return <PoliciesView />;
      case 'admin':
        return (
          <AdminView 
            isAdminLoggedIn={isAdminLoggedIn} 
            onLoginAdmin={() => setIsAdminLoggedIn(true)} 
          />
        );
      default:
        return <HomeView onChangeTab={setCurrentTab} onSelectProduct={handleSelectProduct} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030615] text-slate-100 flex flex-col justify-between selection:bg-purple-900/40 selection:text-amber-200 relative overflow-hidden font-sans" id="app_canvas">
      {/* Background radial space gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030615] to-[#010309] pointer-events-none"></div>

      {/* Main navigation */}
      <Navbar 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Active Tab contents */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-6" id="app_main_content">
        {renderTabContent()}
      </main>

      {/* Cosmic Footer */}
      <footer className="relative z-10 border-t border-purple-950/60 bg-[#02040d]/90 py-12 px-4 text-center mt-12" id="app_footer">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-950/30 pb-6">
            {/* Branding */}
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-amber-300 fill-amber-300/15" />
              <span className="font-bold text-slate-100 uppercase tracking-widest text-sm">하루운세</span>
            </div>

            {/* Quick footer tab navigators */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
              <button onClick={() => setCurrentTab('policies')} className="hover:text-amber-200 transition-colors">개인정보처리방침</button>
              <button onClick={() => setCurrentTab('policies')} className="hover:text-amber-200 transition-colors">환불정책</button>
              <button onClick={() => setCurrentTab('faq')} className="hover:text-amber-200 transition-colors">자주 묻는 질문</button>
            </div>
          </div>

          <div className="text-left sm:text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              하루운세의 모든 사주 해석과 타로 풀이는 절대적인 점술 학문이 아닌, 사용자 스스로의 자아성찰과 평화로운 마음의 정돈을 돕기 위한 다정다감한 조언형 예술 콘텐츠입니다. 
              오늘 하루 마음에 잔잔한 등불이 깃들기를 응원합니다.
            </p>
            <p className="text-[10px] text-gray-600">
              © 2026 하루운세 (Haru Unse) Corp. All rights reserved. Powered by Server-Side Gemini AI & DeepMind Antigravity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
