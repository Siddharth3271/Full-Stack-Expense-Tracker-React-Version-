import axios from "axios";
const api=axios.create({
    baseURL:'http://localhost:8081/api/v1',
});


export const loginUser=async(email,password)=>{
    const response=await api.post('user/login',{email,password});
    return response.data;
};

export const registerUser=async(user)=>{
    const response=await api.post(`/user/${user}`);
    return response.data;
};

export const getTransactions=async(userId)=>{
    const response=await api.get(`/transaction/recent/user/${userId}?startPage=0&endPage=0&size=100`);
    return response.data;
};

export const addTransaction=async(transactionData)=>{
    const response=await api.post('/transaction', transactionData);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/user/${id}`); 
    return response.data;
};

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

export const addCategories=async(categoryData)=>{
    const response=await api.post("/transaction-category", categoryData); 
    return response.data;
};

export const deleteCategories=async(id)=>{
    await api.delete(`/transaction-category/${id}`);
}

export const getCategories=async(userId)=>{
    const response=await api.get(`/transaction-category/user/${userId}`);
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

export const getTransactionsByYear=async(userId,year)=>{
    const response=await api.get(`/transaction/user/${userId}?year=${year}`);
    return response.data;
}

export const getTransactionYears=async(userId)=>{
    const response=await api.get(`/transaction/years/${userId}`);
    return response.data;
}

export default api;