import { useEffect } from 'react';
import PendingBetCard from './PendingBetCard';

export default function PendingBets({ pendingBets = [], setPendingBets, setSettledBets }) {
    useEffect(() => {
        localStorage.setItem('pendingBets', JSON.stringify(pendingBets));
    }, [pendingBets]);

    return (
        <div
            style={{
                height: 'calc(100vh - 117px)', // Adjust height leaving space for bottom nav
                overflowY: 'auto',
                padding: '20px',
                boxSizing: 'border-box',
                border: 'none !important',
                borderTop: 'none !important',
                borderRight: 'none !important',
                borderBottom: 'none !important',
                borderLeft: 'none !important',
                outline: 'none !important',
                backgroundColor: 'var(--background-color)',
            }}
        >
            <div
                className="pending-bets-box"
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                }}
            >
                <h2
                    className="pending-bets-title"
                    style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary-color)' }}
                >
                    Pending Bets
                </h2>
                {pendingBets.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
                        No Pending Bets
                    </div>
                ) : (
                    pendingBets.map((bet, i) => (
                        <PendingBetCard
                            key={i}
                            bet={bet}
                            setPendingBets={setPendingBets}
                            setSettledBets={setSettledBets}
                            removeBetById={(id) => {
                                const updated = pendingBets.filter((b) => b.id !== id);
                                setPendingBets(updated);
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}