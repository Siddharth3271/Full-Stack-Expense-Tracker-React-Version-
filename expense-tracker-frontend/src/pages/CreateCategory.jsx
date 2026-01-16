import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCategories } from '../backendApi/api';
import Navbar from "../components/Navbar"

const CreateCategory = () => {
    const navigate=useNavigate();
    // const [user,setUser]=useState(null);

    const [name,setName]=useState("");
    const [color,setColor]=useState("#000000");


    const handleSubmit=async(e)=>{
        e.preventDefault();

        const categoryData={
            categoryName:name,
            categoryColor:color,
        }

        try{
            await addCategories(categoryData);
            alert("Category created successfully!");
            navigate("/dashboard");
        }
        catch(error){
            console.error("Error creating category: ",error);
            alert("Failed to create category");
        }
    }

    // if(!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
            <Navbar/>

            <div className="flex justify-center items-center mt-10 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create New Category</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Category Name Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Category Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Gym, Netflix, Groceries"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Color Picker Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Category Color</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-12 w-20 p-1 border border-gray-300 rounded cursor-pointer bg-white"
                                />
                                <span className="text-gray-500 text-sm">Pick a color to identify this category</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="flex-1 bg-red-500 text-white font-bold py-3 rounded hover:bg-red-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default CreateCategory
