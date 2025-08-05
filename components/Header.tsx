import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HyperNovaLogo: React.FC = () => (
  <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
    <svg width="32" height="32" viewBox="0 0 100 100" className="flex-shrink-0">
      <defs>
        <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#D90429', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#a3031f', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#cca300', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Top face */}
      <path d="M50 5 L95 27.5 L50 50 L5 27.5 Z" fill="url(#grad-yellow)" />
      {/* Left face */}
      <path d="M5 27.5 L5 72.5 L50 95 L50 50 Z" fill="url(#grad-red)" />
      {/* Right face */}
      <path d="M95 27.5 L50 50 L50 95 L95 72.5 Z" fill="#D90429" />
    </svg>
    <span className="font-bold text-nova-light tracking-wider uppercase text-base sm:text-lg md:text-xl whitespace-nowrap">
      HYPERNOVA EXPRESS
    </span>
  </Link>
);


const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-4' : 'space-x-6'}`}>
        <Link to="/track" onClick={() => setIsMenuOpen(false)} className="text-nova-gray hover:text-nova-light transition-colors duration-300">Track</Link>
        <Link to="/book" onClick={() => setIsMenuOpen(false)} className="text-nova-gray hover:text-nova-light transition-colors duration-300">Book Shipment</Link>
        
        {isAdmin && (
          <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-nova-gold hover:text-white transition-colors duration-300">Admin Panel</Link>
        )}

        {isAuthenticated ? (
          <div className={`flex items-center ${isMobile ? 'flex-col space-y-4' : 'space-x-4'}`}>
            <span className="text-nova-light">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-nova-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-full"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="bg-nova-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-full text-center"
          >
            Login / Sign Up
          </Link>
        )}
    </div>
  );

  return (
    <header className="bg-nova-dark/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <HyperNovaLogo />

          <div className="hidden md:flex items-center">
            <NavLinks />
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
              <svg className="w-6 h-6 text-nova-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
           <NavLinks isMobile={true} />
        </div>
      </nav>
    </header>
  );
};

export default Header;