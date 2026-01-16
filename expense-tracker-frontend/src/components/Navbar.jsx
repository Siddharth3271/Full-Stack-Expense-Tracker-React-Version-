import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';

const Navbar = () => {

    const navigate=useNavigate();
    const [isDropdownOpen,setIsDropdownOpen]=useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout=()=>{
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    const name = JSON.parse(localStorage.getItem("user"))?.name;

  return (
    <nav className="bg-gray-500 text-white p-4 shadow-md rounded-b-xl lg:rounded-xl">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Side: Logo */}
                <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300">
                    Expense Tracker
                </Link>

                {/* Mobile Toggle Button */}
                <button 
                    className="lg:hidden block focus:outline-none cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {/* Hamburger Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                {/* Right Side: Menu Items */}
                <div className={`${isMobileMenuOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 w-full lg:w-auto bg-gray-800 lg:bg-transparent p-4 lg:p-0 items-center gap-6 z-50 transition-all duration-300`}>
                    
                    <Link to="/dashboard" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>

                    {/* Categories Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                            className="flex items-center gap-1 hover:text-gray-300 focus:outline-none cursor-pointer"
                        >
                            Categories ▼
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute lg:right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-50">
                                <Link 
                                    to="/categories" 
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                >
                                    View Categories
                                </Link>
                                <Link 
                                    to="/add-category" 
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                >
                                    Create Category
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* User Info & Logout */}
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:border-l lg:pl-4 border-gray-600 w-full lg:w-auto pt-4 lg:pt-0">
                        <span className="text-sm text-gray-200">Hello, {name}</span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-6 lg:px-3 py-2 lg:py-1 rounded text-sm transition hover:scale-105 cursor-pointer w-full lg:w-auto"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
  )
}

export default Navbar
