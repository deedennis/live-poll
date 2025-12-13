import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaChartBar, FaPoll, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import useUserStore from "../../store/useStore";
import useLogout from "../../hooks/useLogout";
import Button from "../Button/Button";

function Header() {
  const { user } = useUserStore();
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/poll", label: "Polls", icon: <FaPoll /> },
    ...(user.username ? [
      { path: "/dashboard", label: "Dashboard", icon: <FaChartBar /> },
      { path: "/bookmark", label: "Bookmarks", icon: <FaUser /> }
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm lg:text-base">LP</span>
            </div>
            <span className="text-xl lg:text-2xl font-display font-bold text-gradient-primary">
              LyzrAI Live Vote Poll App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user.username ? (
              <div className="flex items-center space-x-4">
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.username[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">{user.username}</span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-dark-800/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {user.username ? (
                <div className="px-4 py-3 border-t border-white/10 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.username[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-medium">{user.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-white/10 mt-4 space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      navigate("/register");
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;