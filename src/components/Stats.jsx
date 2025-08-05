import BetStats from './BetStats';
import WeeklySummary from './WeeklySummary';

export default function Stats() {
  return (
    <div className="stats-page" style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '20px' }}>Your Stats</h2>
      <BetStats />
      <hr style={{ margin: '40px 0', borderColor: 'var(--primary-color)' }} />
      <WeeklySummary />
    </div>
  );
}