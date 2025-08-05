
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-nova-dark text-nova-light font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout;
