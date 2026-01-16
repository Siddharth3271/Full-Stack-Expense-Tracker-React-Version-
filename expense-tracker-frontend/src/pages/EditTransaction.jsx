import React, { useEffect, useState } from 'react'
import { useNavigate , useParams} from 'react-router-dom';
import { getCategories, getTransactionId, updateTransaction } from '../backendApi/api';
import Navbar from "../components/Navbar";

const EditTransaction = () => {

    const navigate=useNavigate();
    const {id}=useParams();
    // const [user, setUser]=useState(null);

    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState(0);
    const [date, setDate]=useState("");
    const [categoryId,setCategoryId]=useState("");
    const [categories,setCategories]=useState([]);
    const [type,setType]=useState("expense");

    const loadData=async()=>{
        try{
            const cat=await getCategories();
            setCategories(cat);

            const transaction=await getTransactionId(id);
            setDescription(transaction.transactionName);
            setDate(transaction.transactionDate);
            setCategoryId(transaction.transactionCategory.id);

            const amt=transaction.transactionAmount;
            setAmount(Math.abs(amt));
            setType(amt>0?"income":"expense");
        }
        catch(error){
            console.error("Error loading data:",error);
            navigate("/login");
        }
    };

    useEffect(()=>{
        loadData();
    },[id]);

    const handleSubmit=async(e)=>{
            e.preventDefault();
    
            const finalAmount=parseFloat(amount);
            const adjustedAmount=type=="expense"?-Math.abs(finalAmount):Math.abs(finalAmount);
    
            const transactionData={
                transactionName: description,
                transactionAmount:adjustedAmount,
                transactionDate:date,
                transactionCategory:{id:parseInt(categoryId)},
            };
    
            console.log("SENDING DATA:", transactionData);
    
            try{
                await updateTransaction(id,transactionData);
                alert("Transaction Updated!");
                navigate("/dashboard");
            }
            catch(error){
                console.error("Error updating transaction:",error);
                alert("Failed to update transaction");
            }
        }

        // if(!user) return null;
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="flex justify-center items-center mt-10 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Same fields as AddTransaction */}
            <div>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded" required />
            </div>
            <div>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded" required />
            </div>
            <div>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded" required />
            </div>
            <div>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded bg-white">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="income" checked={type === "income"} onChange={() => setType("income")} className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Income</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="expense" checked={type === "expense"} onChange={() => setType("expense")} className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-700">Expense</span>
                </label>
            </div>
            <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">Update</button>
                <button type="button" onClick={() => navigate("/dashboard")} className="flex-1 bg-red-500 text-white font-bold py-3 rounded hover:bg-red-600 transition">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditTransaction
