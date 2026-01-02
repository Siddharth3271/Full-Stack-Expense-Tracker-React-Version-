import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MonthlyBarChart = ({monthlyData}) => {

    const labels=monthlyData.map(d=>d.month);
    const data={
        labels,
        datasets:[
            {
                label: "Income",
                data: monthlyData.map(d=>d.income),
                backgroundColor: "#16a34a"
            },{
                label: "Expense",
                data: monthlyData.map(d=>d.expense),
                backgroundColor: "#dc2626"
            }
        ]
    };

    const options={
        responsive:true,
        maintainAspectRatio:false,
        plugins: {
            legend: { position: "top" }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

  return (
    <div className='h-80'>
      <Bar data={data} options={options}/>
    </div>
  )
}

export default MonthlyBarChart
