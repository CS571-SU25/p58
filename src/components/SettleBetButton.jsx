import { useState, useEffect } from 'react';

export default function SettleBetButton({ bet, setPendingBets, removeBetById }) {
    if (!bet || !bet.legs) return null;
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [isWin, setIsWin] = useState(null);
  const [legSuccess, setLegSuccess] = useState([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (showModal && bet?.legs?.length) {
      setLegSuccess(bet.legs.map(() => false));
    }
  }, [showModal, bet]);

  const handleSettle = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleToggleLeg = (index) => {
    const updated = [...legSuccess];
    updated[index] = !updated[index];
    setLegSuccess(updated);
  };

  const handleSave = () => {
    setAttemptedSubmit(true);
    if (!selectedDate || isWin === null) return;
    setShowModal(false); // Immediately close the modal

    const newEntry = {
      id: Date.now(),
      date: selectedDate,
      legs: bet.legs.map((leg, i) => ({
        ...leg,
        successful: legSuccess[i],
        // Optionally include playerName, overUnder, line, stat for display in Calendar.jsx
        playerName: leg.playerName,
        overUnder: leg.overUnder,
        line: leg.line,
        stat: leg.stat
      })),
      risk: bet.risk,
      payout: bet.payout,
      won: isWin
    };

    const existing = JSON.parse(localStorage.getItem('settledBets') || '[]');
    const updated = [...existing, newEntry];
    localStorage.setItem('settledBets', JSON.stringify(updated));
    // Update dailyTotals in localStorage
    const netAmount = isWin ? Number(bet.payout) : -Number(bet.risk);
    const dailyTotals = JSON.parse(localStorage.getItem('dailyTotals') || '{}');
    dailyTotals[selectedDate] = (dailyTotals[selectedDate] || 0) + netAmount;
    localStorage.setItem('dailyTotals', JSON.stringify(dailyTotals));

    // Remove bet from pendingBets in localStorage and update UI
    const existingPending = JSON.parse(localStorage.getItem('pendingBets') || '[]');
    const updatedPending = existingPending.filter(b => String(b.id) !== String(bet.id));
    localStorage.setItem('pendingBets', JSON.stringify(updatedPending));

    if (typeof setPendingBets === 'function') {
      setPendingBets(updatedPending);
    }

    // Delete the settled bet from localStorage and update UI
    const existingPendingForDelete = JSON.parse(localStorage.getItem('pendingBets') || '[]');
    const updatedPendingForDelete = existingPendingForDelete.filter(b => String(b.id) !== String(bet.id));
    localStorage.setItem('pendingBets', JSON.stringify(updatedPendingForDelete));
    if (typeof setPendingBets === 'function') {
      setPendingBets(updatedPendingForDelete);
    }

    // Automatically refresh the screen after settling the bet
    window.location.reload();
  };

  return (
    <>
      <button
        className="settle-button"
        onClick={handleSettle}
        style={{ color: 'var(--background-color)' }}
      >
        Settle
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--background-color)',
            padding: '24px',
            borderRadius: '8px',
            minWidth: '320px',
            maxWidth: '90%',
            color: 'var(--text-color)'
          }}>
            <h2 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>Settle Bet</h2>

            {bet.legs.map((leg, index) => (
              <div key={index} style={{
                border: '1px solid var(--primary-color)',
                padding: '10px',
                marginBottom: '10px'
              }}>
                <div style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
                  {leg.description || 'Leg'}
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px' }}>
                  <input
                    type="checkbox"
                    id={`leg-success-${index}`}
                    checked={legSuccess[index]}
                    onChange={() => handleToggleLeg(index)}
                  />
                  <label htmlFor={`leg-success-${index}`} style={{ marginLeft: '6px' }}>Successful</label>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
              <div>
                <div style={{ color: 'red', textAlign: 'center' }}>Risk:</div>
                <div style={{ border: '1px solid red', padding: '4px 12px', textAlign: 'center', color: 'red' }}>${Number(bet.risk).toFixed(2)}</div>
              </div>
              <div>
                <div style={{ color: 'green', textAlign: 'center' }}>Payout:</div>
                <div style={{ border: '1px solid green', padding: '4px 12px', textAlign: 'center', color: 'green' }}>${Number(bet.payout).toFixed(2)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
              <button
                style={{
                  border: isWin === true ? '1px solid var(--primary-color)' : (isWin === null && attemptedSubmit ? '1px solid red' : '1px solid var(--primary-color)'),
                  color: isWin === true ? 'var(--background-color)' : 'var(--primary-color)',
                  background: isWin === true ? 'var(--primary-color)' : 'transparent'
                }}
                onClick={() => setIsWin(true)}
                aria-pressed={isWin === true}
              >
                Win
              </button>
              <button
                style={{
                  border: isWin === false ? '1px solid var(--primary-color)' : (isWin === null && attemptedSubmit ? '1px solid red' : '1px solid var(--primary-color)'),
                  color: isWin === false ? 'var(--background-color)' : 'var(--primary-color)',
                  background: isWin === false ? 'var(--primary-color)' : 'transparent'
                }}
                onClick={() => setIsWin(false)}
                aria-pressed={isWin === false}
              >
                Loss
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Date:</div>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  marginTop: '5px',
                  padding: '5px',
                  color: 'var(--primary-color)',
                  accentColor: 'var(--primary-color)',
                  border: '1px solid var(--primary-color)',
                  backgroundColor: 'var(--background-color)',
                  filter: 'invert(0)' // ensures icon is visible against light background
                }}
              />
            </div>

            <div style={{ display: 'flex', marginTop: '20px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--background-color)',
                  border: 'none'
                }}
                onClick={handleSave}
              >
                Settle Bet
              </button>
              <button style={{
                flex: 1,
                padding: '10px',
                backgroundColor: 'crimson',
                color: 'var(--background-color)',
                border: 'none'
              }} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}