import {
  Bar,
  Line,
  Pie,
  Doughnut
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { CHART_TYPE } from "../analysis.constant.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const AnalysisChart = ({ data, chartType }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  // 🔹 labels decide karo (date ya category)
  const labels = data.map(
    (item) => item.category || item.date
  );

  const values = data.map(
    (item) => item.total_amount || item.amount || 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Amount",
        data: values,
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#f87171",
          "#fbbf24",
          "#a78bfa"
        ]
      }
    ]
  };

  const commonProps = {
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow h-96">
      {chartType === CHART_TYPE.BAR && <Bar {...commonProps} />}
      {chartType === CHART_TYPE.LINE && <Line {...commonProps} />}
      {chartType === CHART_TYPE.PIE && <Pie {...commonProps} />}
      {chartType === CHART_TYPE.DOUGHNUT && <Doughnut {...commonProps} />}
    </div>
  );
};

export default AnalysisChart;
