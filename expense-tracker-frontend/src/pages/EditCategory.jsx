import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCategoryById , updateCategory} from '../backendApi/api';
import Navbar from "../components/Navbar"

const EditCategory = () => {
    const navigate=useNavigate();
    const {id} =useParams();
    // const [user, setUser]=useState(null);
    const [name,setName]=useState("");
    const [color,setColor]=useState("#000000");

    const loadCategoryData=async()=>{
        try{
            const data=await getCategoryById(id);
            setName(data.categoryName);
            setColor(data.categoryColor);
        }
        catch(error){
            console.error("Error loading category",error);
            alert("Failed to load category data");
            navigate("/login");
        }
    };

    useEffect(()=>{
        loadCategoryData();
    },[id]);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            await updateCategory(id, {
                categoryName: name,
                categoryColor:color
            });
            alert("Category updated successfully!");
            navigate("/categories");
        }
        catch(error){
            console.error("Error updating category",error);
            alert("Failed to update category.")
        }
    }

    // if(!user) return null;
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>

      <div className="flex justify-center items-center mt-10 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Category</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Color Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-12 w-20 p-1 border border-gray-300 rounded cursor-pointer bg-white"
                />
                <span className="text-gray-500 text-sm">{color}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
                    Update
                </button>
                <button type="button" onClick={() => navigate("/categories")} className="flex-1 bg-red-500 text-white font-bold py-3 rounded hover:bg-red-600 transition">
                    Cancel
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCategory
