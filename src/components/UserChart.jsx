import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function UserChart({ userCount }) {
  const data = {
    labels: ['Pengguna'],
    datasets: [
      {
        label: 'Jumlah Pengguna',
        data: [userCount],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  return <Bar data={data} />;
}
