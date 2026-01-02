import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar"
import { getTransactions, deleteTransaction, getTransactionYears } from '../backendApi/api';
import MonthlyBarChart from "../components/MonthlyBarChart";
import CategoryPieChart from '../components/CategoryPieChart';
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [availableYears, setAvailableYears] = useState([]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this transaction?");

        if (confirm) {
            try {
                await deleteTransaction(id);

                const updateTransactions = transactions.filter(t => t.id !== id);
                setTransactions(updateTransactions);
            }
            catch (error) {
                console.error("Error deleting transaction", error);
                alert("Failed to delete");
            }
        }
    }

    useEffect(() => {
        let income = 0;
        let expense = 0;

        transactions.forEach((t) => {
            const amt = t.transactionAmount || 0;
            if (amt > 0) income += amt;
            else expense += amt;
        });
        setTotalIncome(income);
        setTotalExpense(Math.abs(expense));
        setBalance(income + expense);
    }, [transactions]);


    const fetchData = async (userId) => {
        try {
            const data = await getTransactions(userId);
            console.log("DEBUG DATA:", data);
            setTransactions(data);
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
            fetchData(JSON.parse(loggedInUser).id);

            getTransactionYears(JSON.parse(loggedInUser).id)
                .then(years => {
                    setAvailableYears(years);
                    if (years.length > 0) {
                        setSelectedYear(years[0]);
                    }
                })
                .catch(err => console.error("Error loading years", err));
        }
        else {
            navigate("/login");
        }
    }, [navigate]);

    const getMonthlyData = (transactions, year) => {
        const months = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];

        const summary = months.map(month => ({
            month, income: 0, expense: 0
        }))

        transactions.forEach(t => {
            if (!t.transactionDate) return;

            const date = new Date(t.transactionDate);
            if (date.getFullYear() != year) return;

            const monthIndex = date.getMonth();
            const amount = t.transactionAmount || 0;

            if (amount > 0) {
                summary[monthIndex].income += amount;
            }
            else {
                summary[monthIndex].expense += Math.abs(amount);
            }
        })
        return summary;
    }

    const getCategoryWiseData=(transactions,year,type)=>{
        const map={};
        transactions.forEach(t=>{
            if(!t.transactionDate || !t.transactionCategory) return;
            const date=new Date(t.transactionDate);

            if(date.getFullYear()!=year) return;
            const amount=t.transactionAmount || 0;

            if((type==="income" && amount<0) || (type==="expense" && amount>0)) return;

            const categoryName=t.transactionCategory.categoryName;
            const value= Math.abs(amount);

            map[categoryName]=(map[categoryName] || 0)+value;
        })

        return {labels: Object.keys(map), data: Object.values(map) };
    }

    const monthlyData = getMonthlyData(transactions, selectedYear);

    if (!user) return null;


    const incomeCategoryData=getCategoryWiseData(
        transactions,
        selectedYear,
        "income"
    );

    const expenseCategoryData=getCategoryWiseData(
        transactions,
        selectedYear,
        "expense"
    );

    const incomeColors = [
    "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"
    ];

    const expenseColors = [
    "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca"
    ];



    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <Navbar user={user} />

            {/* --- TOP CARDS (Balance, Income, Expense) --- */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Balance */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Current Balance</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        ₹{balance.toFixed(2)}
                    </p>
                </div>

                {/* Card 2: Income */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Income</h3>
                    <p className="text-2xl font-bold text-green-600">
                        +₹{totalIncome.toFixed(2)}
                    </p>
                </div>

                {/* Card 3: Expense */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Expense</h3>
                    <p className="text-2xl font-bold text-red-600">
                        -₹{totalExpense.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 leading-tight">

                {/* LEFT COLUMN: Monthly Table (Takes up 2 parts of space) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">Monthly Breakdown</h2>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="border px-3 py-1 rounded bg-white hover:cursor-pointer"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <MonthlyBarChart monthlyData={monthlyData} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <CategoryPieChart
                            title={`Income by Category (${selectedYear})`}
                            labels={incomeCategoryData.labels}
                            data={incomeCategoryData.data}
                            colors={incomeColors}
                        />

                        <CategoryPieChart
                            title={`Expense by Category (${selectedYear})`}
                            labels={expenseCategoryData.labels}
                            data={expenseCategoryData.data}
                            colors={expenseColors}
                        />
                    </div>


                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-left">Month</th>
                                <th className="p-3 text-right">Income</th>
                                <th className="p-3 text-right">Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map(row => (
                                <tr key={row.month} className="border-t">
                                    <td className="p-3 font-medium leading-tight">{row.month}</td>
                                    <td className="p-3 text-right text-green-600 leading-tight">
                                        ₹{row.income.toFixed(2)}
                                    </td>
                                    <td className="p-3 text-right text-red-500 leading-tight">
                                        ₹{row.expense.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* RIGHT COLUMN: Recent Transactions (Takes up 1 part of space) */}
                <div className="bg-white p-6 rounded-lg shadow-md h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">Recent History</h2>
                        <Link to="/add-transaction" className="text-blue-500 text-sm hover:underline">+ Add New</Link>
                    </div>

                    {transactions.length === 0 ? (
                        <p className='text-gray-400 text-center mt-10'>No transactions yet.</p>
                    ) : (
                        transactions.map((t) => (
                            <div key={t.id} className='mb-4 p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center'>
                                <div>
                                    {/* Show Category Name (if it exists) */}
                                    <p className={`text-sm font-bold`} style={{ color: t.transactionCategory?.categoryColor || '#000' }}>
                                        {t.transactionCategory?.categoryName || "Uncategorized"}
                                    </p>
                                    <p className="text-xl text-gray-700">{t.transactionName}</p>
                                    <p className="text-sm text-gray-500">{t.transactionDate}</p>
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <p className={`font-bold ${t.transactionAmount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {t.transactionAmount > 0 ? "+" : "-"}₹{Math.abs(t.transactionAmount).toFixed(2)}
                                    </p>

                                    <button className="px-3 py-1 text-amber-700 border border-amber-400 rounded-xl bg-amber-200 hover:bg-amber-300 cursor-pointer" onClick={() => navigate(`/edit-transaction/${t.id}`)}>Edit</button>

                                    <button className="px-3 py-1 text-red-700 border border-red-400 rounded-xl bg-red-200 hover:bg-red-300 cursor-pointer" onClick={() => handleDelete(t.id)}>Delete</button>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
