import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-codevault-background overflow-hidden relative text-white">
      {/* Background Glowing Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(121,40,202,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px] opacity-60 animate-[drift_20s_infinite_alternate_ease-in-out]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,225,255,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[100px] opacity-60 animate-[drift_20s_infinite_alternate_ease-in-out] [animation-delay:-10s]" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Navbar />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
