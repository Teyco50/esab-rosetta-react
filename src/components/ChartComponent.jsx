import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export const LineChart = ({ data }) => (
  <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
)

export const BarChart = ({ data }) => (
  <Bar data={data} options={{ responsive: true, indexAxis: undefined }} />
)

export const DoughnutChart = ({ data }) => (
  <Doughnut data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
)
