import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WeeklySummary() {
  const [summary, setSummary] = useState({
    total: 0,
    wins: 0,
    losses: 0,
    netProfit: 0
  });

  useEffect(() => {
    const now = new Date();
    // Calculate start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate end of current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const settled = JSON.parse(localStorage.getItem('settledBets') || '[]');
    const recent = settled.filter(bet => {
      const betDate = new Date(bet.date);
      return betDate >= startOfWeek && betDate <= endOfWeek;
    });

    const wins = recent.filter(b => b.won).length;
    const losses = recent.filter(b => !b.won).length;
    const netProfit = recent.reduce((acc, b) => {
      return acc + (b.won ? Number(b.payout) : -Number(b.risk));
    }, 0);

    setSummary({
      total: recent.length,
      wins,
      losses,
      netProfit
    });
  }, []);

  //Graph
  const barData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Daily Net Profit',
        data: Array(7).fill(0),
        backgroundColor: 'rgba(0, 255, 255, 0.5)',
        borderColor: 'var(--primary-color)',
        borderWidth: 1,
      },
    ],
  };

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const settled = JSON.parse(localStorage.getItem('settledBets') || '[]');
  settled.forEach(bet => {
    const betDate = new Date(bet.date);
    const dayIndex = betDate.getDay();
    if (betDate >= startOfWeek && betDate <= new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)) {
      const value = bet.won ? Number(bet.payout) : -Number(bet.risk);
      barData.datasets[0].data[dayIndex] += value;
    }
  });

  return (
    <div style={{
      border: '1px solid var(--primary-color)',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'var(--card-background)',
      color: 'var(--text-color)'
    }}>
      <h3 style={{ color: 'var(--primary-color)' }}>Weekly Summary</h3>
      <p>Total Bets Settled: <strong>{summary.total}</strong></p>
      <p>Wins: <strong>{summary.wins}</strong></p>
      <p>Losses: <strong>{summary.losses}</strong></p>
      <p>
        Net Profit/Loss:{' '}
        <strong style={{ color: summary.netProfit >= 0 ? 'green' : 'red' }}>
          {summary.netProfit >= 0 ? '+' : '-'}${Math.abs(summary.netProfit).toFixed(2)}
        </strong>
      </p>
      <div style={{ marginTop: '20px' }}>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}