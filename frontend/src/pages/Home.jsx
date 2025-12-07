import React from 'react';
import MobileBottomNav from '../components/MobileBottomNav';

const Home = () => {

  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0">
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Left Section - Gift Shop */}
        <div className="relative h-[600px] md:h-[calc(100vh-120px)] overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gray-200">
            {/* Placeholder for man with glasses image */}
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm">Gift Shop Image</p>
              </div>
            </div>
          </div>
          {/* Overlay Box */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">gift shop</div>
            <h3 className="text-2xl md:text-3xl font-light mb-2 text-gray-900">GIFT IDEAS ?</h3>
            <p className="text-sm md:text-base text-gray-600">WE SORT IT OUT FOR YOU.</p>
          </div>
        </div>

        {/* Middle Section - Museum Garments */}
        <div className="relative h-[600px] md:h-[calc(100vh-120px)] overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gray-100">
            {/* Placeholder for folded shirts image */}
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-sm">Shirts Image</p>
              </div>
            </div>
          </div>
          {/* Overlay Box */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">neeed</div>
            <h3 className="text-2xl md:text-3xl font-light mb-2 text-gray-900">MUSEUM GARMENTS</h3>
            <p className="text-sm md:text-base text-gray-600">NEW SHIRTS DROP</p>
          </div>
        </div>

        {/* Right Section - Gift Cards */}
        <div className="relative h-[600px] md:h-[calc(100vh-120px)] overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gray-50">
            {/* Placeholder for flat lay with gift cards */}
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Gift Cards Image</p>
              </div>
            </div>
          </div>
          {/* Overlay Box */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">gift cards</div>
            <h3 className="text-2xl md:text-3xl font-light mb-2 text-gray-900">STYLEIT GIFT CARD</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-sm px-3 py-1 bg-gray-100 rounded">20€</span>
              <span className="text-sm px-3 py-1 bg-gray-100 rounded">50€</span>
              <span className="text-sm px-3 py-1 bg-gray-100 rounded">100€</span>
              <span className="text-sm px-3 py-1 bg-gray-100 rounded">150€</span>
              <span className="text-sm px-3 py-1 bg-gray-100 rounded">200€</span>
              <span className="text-sm px-3 py-1 bg-gray-100 rounded">300€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Home;
