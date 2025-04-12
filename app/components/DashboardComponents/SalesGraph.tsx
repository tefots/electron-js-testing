"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function SalesGraph() {
  // Sample sales data derived from original activities
  const salesData = [
    { id: 1, user: "Thabo Makatle", itemsSold: 4, action: "Sold 4 peach trees" },
    {
      id: 2,
      user: "Lereko Halieo",
      itemsSold: 20,
      action: "Ordered 20 Lemon trees",
    },
    {
      id: 3,
      user: "Bohlokoa Tholoana",
      itemsSold: 8,
      action: "Sold 8 rose flower tree",
    },
  ];

  // Chart.js data configuration
  const chartData = {
    labels: salesData.map((sale) => sale.user), // X-axis: User names
    datasets: [
      {
        label: "Items Sold",
        data: salesData.map((sale) => sale.itemsSold), // Y-axis: Number of items
        backgroundColor: "rgba(34, 197, 94, 0.6)", // Green shade matching text-green-600
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options for customization
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we have one dataset
      },
      title: {
        display: false, // Title is handled by CardTitle
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Items Sold",
        },
        ticks: {
          stepSize: 5, // Adjust for cleaner intervals
        },
      },
      x: {
        title: {
          display: true,
          text: "Customers",
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}