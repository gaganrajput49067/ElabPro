import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  tension: 0.3,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [34, 34, 56, 78, 45, 33, 90],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgb(255, 99, 132)",
      fill: {
        target: "origin", // 3. Set the fill options
        above: "rgba(255, 0, 0, 0.3)",
      },
    },
    {
      label: "Dataset 2",
      data: [55, 33, 45, 65, 34, 56, 200],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      fill: "origin", // 3. Set the fill options
    },
  ],
};

function DashboardChat() {
  return <Line options={options} data={data} width={100} height={50} />;
}

export default DashboardChat;
