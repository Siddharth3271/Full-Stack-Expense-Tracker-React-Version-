import axios from "axios";
const api=axios.create({
    baseURL:'http://localhost:8081/api/v1',
});

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("accessToken");
    if(token){
      config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
  },(error)=>Promise.reject(error));

//signin and signout mechanism
export const loginUser=async(email,password)=>{
    const response=await api.post('auth/signin',{email,password});
    localStorage.setItem("accessToken",response.data.accessToken);
    return response.data;
};

export const registerUser=async(user)=>{
    const response=await api.post("/auth/signup",user);
    return response.data;
};

export const logoutUser=()=>{
  localStorage.removeItem("accessToken");
};

//transactions

export const getTransactions=async()=>{
    const response=await api.get("/transaction/recent/me?startPage=0&endPage=0&size=100");
    return response.data;
};

export const addTransaction=async(transactionData)=>{
    const response=await api.post('/transaction', transactionData);
    return response.data;
};

export const getTransactionsByYear=async(year,month=null)=>{
    let url=`/transaction/me?year=${year}`;
    if(month!=null) url+=`&month=${month}`;
    const response=await api.get(url);
    return response.data;
}

export const getTransactionYears=async()=>{
    const response=await api.get("/transaction/years/me");
    return response.data;
}

// export const getUserById = async (id) => {
//     const response = await api.get(`/user/${id}`); 
//     return response.data;
// };

export const deleteTransaction= async(id)=>{
    await api.delete(`/transaction/${id}`);
};

export const getTransactionId=async(id)=>{
    const response=await api.get(`/transaction/${id}`);
    return response.data;
};

export const updateTransaction=async(id,transactionData)=>{
    const response=await api.put(`/transaction/${id}`,transactionData);
    return response.data;
};

//categories

export const addCategories=async(categoryData)=>{
    const response=await api.post("/transaction-category", categoryData); 
    return response.data;
};

export const deleteCategories=async(id)=>{
    await api.delete(`/transaction-category/${id}`);
}

export const getCategories=async()=>{
    const response=await api.get("/transaction-category/me");
    return response.data;
};

export const updateCategory=async(id,categoryData)=>{
    const response=await api.put(`/transaction-category/${id}`, categoryData);
    return response.data;
};

export const getCategoryById=async(id)=>{
    const response=await api.get(`/transaction-category/${id}`);
    return response.data;
};

export default api;