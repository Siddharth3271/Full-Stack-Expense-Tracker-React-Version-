import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({user}) => {

    const navigate=useNavigate();
    const [isDropdownOpen,setIsDropdownOpen]=React.useState(false);

    const handleLogout=()=>{
        localStorage.removeItem("user");
        navigate("/login");
    };

  return (
    <nav className="bg-gray-500 text-white p-4 shadow-md rounded-xl">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300">
          Expense Tracker
        </Link>

        {/* Right Side: Menu Items */}
        <div className="flex items-center gap-6">
          
          {/* Dashboard Link */}
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>

          {/* Categories Dropdown (The "File" Menu equivalent) */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-1 hover:text-gray-300 focus:outline-none cursor-pointer"
            >
              Categories ▼
            </button>

            {/* Conditional Rendering: Only show if isDropdownOpen is TRUE */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-50">
                <Link 
                  to="/categories" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)} // Close menu when clicked
                >
                  View Categories
                </Link>
                <Link 
                  to="/add-category" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Create Category
                </Link>
              </div>
            )}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4 border-l pl-4 border-gray-300">
            <span className="text-sm text-gray-300">Hello, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition hover:scale-105 cursor-pointer"
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
