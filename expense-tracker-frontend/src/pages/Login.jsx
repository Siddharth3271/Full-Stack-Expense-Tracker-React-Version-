import React, { useState } from 'react'
import { useNavigate , Link } from 'react-router-dom';
import { loginUser } from '../backendApi/api';

const Login = () => {

    const [formData,setFormData]=useState({
        email:"",
        password:"",
    })

    const [error,setError]=useState(null);
    const navigate=useNavigate();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            await loginUser(formData.email,formData.password);
            
            console.log("Login successful");

            // localStorage.setItem("user",JSON.stringify(user));
            alert("Login Successful!");
            navigate("/dashboard");
        }
        catch(err){
            console.error("Login failed",err);
            setError("Invalid email or password");
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        
        {/* Show error message if it exists */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Sign In
          </button>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
