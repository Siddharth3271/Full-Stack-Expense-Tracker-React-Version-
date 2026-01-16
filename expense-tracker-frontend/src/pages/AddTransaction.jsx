import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { addTransaction, getCategories } from '../backendApi/api';
const AddTransaction = () => {
    const navigate=useNavigate();

    // const [user, setUser]=useState(null);

    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState("");
    const [date,setDate]=useState(new Date().toISOString().split('T')[0])
    const [categoryId,setCategoryId]=useState("");
    const [categories,setCategories]=useState([]);
    const [type,setType]=useState("expense");

    const fetchCategories=async()=>{
        try{
            const data=await getCategories();
            setCategories(data);

            if(data.length>0) setCategoryId(data[0].id);
        }
        catch(error){
            console.error("Error fetching categories:",error);
            navigate("/login");
        }
    }

    useEffect(()=>{
        fetchCategories();
    },[navigate]);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        const finalAmount=parseFloat(amount);
        const adjustedAmount=type==="expense"?-Math.abs(finalAmount):Math.abs(finalAmount);

        const transactionData={
            transactionName: description,
            transactionAmount:adjustedAmount,
            transactionDate:date,
            transactionCategory:{id:parseInt(categoryId)},
        };

        console.log("SENDING DATA:", transactionData);

        try{
            await addTransaction(transactionData);
            alert("Transaction added successfully!");
            navigate("/dashboard");
        }
        catch(error){
            console.error("Error adding transaction:",error);
            alert("Failed to add transaction");
        }
    }

    const handleCancel=()=>{
        navigate("/dashboard");
    }

    // if(!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>

      <div className="flex justify-center items-center mt-10 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Transaction</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. Description Input */}
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description (e.g. Salary, Lunch)"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 2. Amount Input */}
            <div>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Transaction Amount"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 3. Date Input */}
            <div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                required
              />
            </div>

            {/* 4. Category Dropdown */}
            <div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Income / Expense Toggle (Radio Buttons) */}
            <div className="flex justify-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="type" 
                        value="income" 
                        checked={type === "income"}
                        onChange={() => setType("income")}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-700">Income</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="type" 
                        value="expense" 
                        checked={type === "expense"}
                        onChange={() => setType("expense")}
                        className="w-5 h-5 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-medium text-gray-700">Expense</span>
                </label>
            </div>

            {/* 6. Action Buttons (Save & Cancel) */}
            <div className="flex gap-4 pt-2">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
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

export default AddTransaction
