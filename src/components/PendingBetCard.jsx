import SettleBetButton from './SettleBetButton';
import { useEffect, useState } from 'react';
import DeletePending from './DeletePending';

export default function PendingBetCard({ bet, setSettledBets, setPendingBets }) {
  return (
    <div className="bet-entry" style={{
      border: '2px solid var(--primary-color)',
      padding: '16px',
      marginBottom: '16px',
      borderRadius: '8px',
      backgroundColor: 'var(--card-background)',
      color: 'var(--text-color)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      minWidth: '600px',
      maxWidth: '90%',
      minHeight: '160px'
    }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--primary-color)', fontWeight: 'bold' }}>1-Leg Parlay</h3>
        <div style={{ marginTop: '6px', fontSize: '14px' }}>
          {Array.isArray(bet.legs) && bet.legs.map((leg, idx) => {
            if (typeof leg === 'string') return <div key={idx} style={{ textAlign: 'left' }}>{leg}</div>;
            return (
              <div key={idx} style={{ textAlign: 'left' }}>
                {leg.type === 'Player Prop' && (
                  <div style={{ fontSize: '12px', marginTop: '4px', textAlign: 'left' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{leg.playerName}</span>{' '}
                    <span style={{ color: leg.overUnder === 'Over' ? 'green' : 'red', fontWeight: 'bold' }}>{leg.overUnder}</span>{' '}
                    <span style={{ color: 'var(--primary-color)' }}>{leg.line} {leg.stat}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
          Risk: ${bet.risk ? parseFloat(bet.risk).toFixed(2) : '0.00'}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'green' }}>
          Payout: ${bet.payout ? parseFloat(bet.payout).toFixed(2) : '0.00'}
        </div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <SettleBetButton
              bet={bet}
              setSettledBets={setSettledBets}
              setPendingBets={setPendingBets}
              removeBetById={(id) => {
                const existing = JSON.parse(localStorage.getItem('pendingBets') || '[]');
                const updated = existing.filter(b => String(b.id) !== String(id));
                localStorage.setItem('pendingBets', JSON.stringify(updated));
                if (typeof setPendingBets === 'function') {
                  setPendingBets(updated);
                }
              }}
            />
           <DeletePending bet={bet} setPendingBets={setPendingBets} />
          </div>
        </div>
      </div>
    </div>
  );
}