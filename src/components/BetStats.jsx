

import { useEffect, useState } from 'react';

export default function BetStats() {
  const [stats, setStats] = useState({
    total: 0,
    wins: 0,
    winRate: 0,
    totalProfit: 0,
    avgRisk: 0,
    avgPayout: 0
  });

  useEffect(() => {
    const settled = JSON.parse(localStorage.getItem('settledBets') || '[]');
    if (settled.length === 0) return;

    const wins = settled.filter(b => b.won).length;
    const totalProfit = settled.reduce((acc, b) => {
      return acc + (b.won ? Number(b.payout) : -Number(b.risk));
    }, 0);
    const avgRisk = settled.reduce((acc, b) => acc + Number(b.risk), 0) / settled.length;
    const avgPayout = settled.reduce((acc, b) => acc + Number(b.payout), 0) / settled.length;

    setStats({
      total: settled.length,
      wins,
      winRate: ((wins / settled.length) * 100).toFixed(1),
      totalProfit,
      avgRisk: avgRisk.toFixed(2),
      avgPayout: avgPayout.toFixed(2)
    });
  }, []);

  return (
    <div style={{
      border: '1px solid var(--primary-color)',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'var(--card-background)',
      color: 'var(--text-color)'
    }}>
      <h3 style={{ color: 'var(--primary-color)' }}>All-Time Stats</h3>
      <p>Total Bets Settled: <strong>{stats.total}</strong></p>
      <p>Wins: <strong>{stats.wins}</strong></p>
      <p>Win Rate: <strong>{stats.winRate}%</strong></p>
      <p>
        Net Profit/Loss:{' '}
        <strong style={{ color: stats.totalProfit >= 0 ? 'green' : 'red' }}>
          {stats.totalProfit >= 0 ? '+' : '-'}${Math.abs(stats.totalProfit).toFixed(2)}
        </strong>
      </p>
      <p>Average Risk: <strong>${stats.avgRisk}</strong></p>
      <p>Average Payout: <strong>${stats.avgPayout}</strong></p>
    </div>
  );
}