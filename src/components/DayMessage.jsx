

import React from 'react';

export default function DayMessage({ bet }) {
  if (!bet || !bet.legs || !Array.isArray(bet.legs)) return null;

  const allLegsSuccessful = bet.legs.every(leg => leg.successful);
  const legCount = bet.legs.length;
  const resultText = bet.won ? `Profit: $${Number(bet.payout).toFixed(2)}` : `Loss: -$${Number(bet.risk).toFixed(2)}`;
  const resultColor = bet.won ? 'green' : 'red';

  return (
    <div
      style={{
        border: '1px solid var(--primary-color)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        backgroundColor: 'var(--card-background)',
        color: 'var(--text-color)',
        maxWidth: '280px'
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>
        {legCount}-Leg Parlay
      </h3>
      {bet.legs.map((leg, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: leg.successful ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
            borderRadius: '4px',
            padding: '6px',
            marginBottom: '6px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'var(--primary-color)'
          }}
        >
          <span style={{ color: 'var(--primary-color)' }}>{leg.playerName}</span>{' '}
          <span style={{
            color: leg.overUnder === 'Under' ? 'red' : 'green',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
          }}>
            {leg.overUnder}
          </span>{' '}
          <span style={{ color: 'var(--primary-color)' }}>{leg.line} {leg.stat}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ color: resultColor, fontWeight: 'bold', fontSize: '16px' }}>{resultText}</div>
        <button
          title="Delete"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'var(--text-color)'
          }}
          onClick={() => {
            if (!window.confirm("Are you sure you want to delete this settled bet?")) return;

            const settledBets = JSON.parse(localStorage.getItem("settledBets") || "[]");
            const updatedSettled = settledBets.filter(b => b.id !== bet.id);
            localStorage.setItem("settledBets", JSON.stringify(updatedSettled));

            const dailyTotals = JSON.parse(localStorage.getItem("dailyTotals") || "{}");
            const date = bet.date;
            const net = bet.won ? Number(bet.payout) : -Number(bet.risk);
            dailyTotals[date] = (dailyTotals[date] || 0) - net;
            localStorage.setItem("dailyTotals", JSON.stringify(dailyTotals));

            window.location.reload();
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}