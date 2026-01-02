import React from 'react'
import { Pie } from 'react-chartjs-2'
import {Chart as ChartJS,ArcElement,Tooltip,Legend} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({title, labels=[], data=[], colors=[]}) => {
    if(labels.length===0){
        return <p className='text-gray-400 text-center'>No Data Available</p>
    }
    
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-center font-semibold mb-2">{title}</h3>

      <div className="h-64">
        <Pie
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors.slice(0,labels.length),
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default CategoryPieChart
