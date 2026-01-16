import React, { useState,useEffect } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import { getCategories , deleteCategories } from '../backendApi/api';
import Navbar from "../components/Navbar"
const ViewCategory = () => {
    const navigate=useNavigate();
    // const [user,setUser]=useState(null);
    const [categories,setCategories]=useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchCategories=async()=>{
            try{
                const data=await getCategories();
                setCategories(data);
            }
            catch(error){
                console.error("Error fetching categories:",error);
                navigate("/login");
            }
            finally {
                setFetching(false);
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

            <div className="container mx-auto p-4 md:p-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Categories</h2>
                    <Link 
                        to="/add-category" 
                        className="w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        + Add New
                    </Link>
                </div>

                {/* Categories Table/List Wrapper */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {fetching ? (
                        <p className="p-10 text-center text-gray-500">Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p className="p-10 text-center text-gray-500">No categories found. Start by adding one!</p>
                    ) : (
                        <div className="overflow-x-auto"> {/* Critical for Mobile responsiveness */}
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Name</th>
                                        <th className="px-4 md:px-6 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Preview</th>
                                        <th className="px-4 md:px-6 py-3 text-right text-gray-500 font-medium text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                            
                                            {/* Category Name */}
                                            <td className="px-4 md:px-6 py-4 font-medium text-gray-800">
                                                {cat.categoryName}
                                            </td>

                                            {/* Color and Code */}
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-300 shadow-sm shrink-0" 
                                                        style={{ backgroundColor: cat.categoryColor }}
                                                    ></div>
                                                    <span className="hidden sm:inline text-xs text-gray-400 font-mono uppercase">
                                                        {cat.categoryColor}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-4 md:px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/edit-category/${cat.id}`)}
                                                        className="p-2 sm:px-3 sm:py-1 text-amber-700 border border-amber-400 rounded-lg bg-amber-50 hover:bg-amber-100 transition"
                                                        title="Edit"
                                                    >
                                                        <span className="hidden sm:inline">Edit</span>
                                                        <span className="sm:hidden">✏️</span>
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-2 sm:px-3 sm:py-1 text-red-700 border border-red-400 rounded-lg bg-red-50 hover:bg-red-100 transition"
                                                        title="Delete"
                                                    >
                                                        <span className="hidden sm:inline">Delete</span>
                                                        <span className="sm:hidden">🗑️</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
  )
};

export default ViewCategory;
