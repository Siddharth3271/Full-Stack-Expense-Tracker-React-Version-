import React, { useState,useEffect } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import { getCategories , deleteCategories } from '../backendApi/api';
import Navbar from "../components/Navbar"
const ViewCategory = () => {
    const navigate=useNavigate();
    // const [user,setUser]=useState(null);
    const [categories,setCategories]=useState([]);

    const fetchCategories=async()=>{
            try{
                const data=await getCategories();
                setCategories(data);
            }
            catch(error){
                console.error("Error fetching categories:",error);
                navigate("/login");
            }
        }
    
        useEffect(()=>{
            fetchCategories();
        },[]);

        const handleDelete=async(id)=>{
            if(window.confirm("Are you sure you want to delete this category?")){
                try{
                    await deleteCategories(id);
                    const updatedCategories=categories.filter(c=>c.id!==id);
                    setCategories(updatedCategories);
                }
                catch(error){
                    console.error("Error deleting category:",error);
                    if(error.response && error.response.status===409){
                        alert(error.response.data);
                    }
                    else{
                        alert("Failed to delete category");
                    }
                }
            }
        };

        // if(!user) return null;
    
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Categories</h2>
          <Link 
            to="/add-category" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add New
          </Link>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categories.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No categories found.</p>
          ) : (
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-gray-500 font-medium text-sm">Name</th>
                  <th className="px-6 py-3 text-gray-500 font-medium text-sm">Color</th>
                  <th className="px-6 py-3 text-right text-gray-500 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    
                    {/* Name */}
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {cat.categoryName}
                    </td>

                    {/* Color Preview */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" 
                          style={{ backgroundColor: cat.categoryColor }}
                        ></div>
                        <span className="text-sm text-gray-500 uppercase">{cat.categoryColor}</span>
                      </div>
                    </td>

                    {/* Buttons */}
                    <td className="px-6 py-4 text-right space-x-2">
                       {/* We will build this edit page next! */}
                      <button 
                        onClick={() => navigate(`/edit-category/${cat.id}`)}
                        className="px-3 py-1 text-amber-700 border border-amber-400 rounded-xl bg-amber-200 hover:bg-amber-300 cursor-pointer"
                      >
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1 text-red-700 border border-red-400 rounded-xl bg-red-200 hover:bg-red-300 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
};

export default ViewCategory;
