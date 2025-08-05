// CalendarDay.jsx
export default function CalendarDay({ day, month, year, isSelected, isToday, onClick }) {
  const dailyTotals = JSON.parse(localStorage.getItem('dailyTotals') || '{}');
  const dateKey = day.toString().padStart(2, '0'); // assume 'day' is numeric, pad for '01', '02', etc.
  const fullDate = `${year}-${month.toString().padStart(2, '0')}-${dateKey}`;
  const total = dailyTotals[fullDate];

  return (
    <div
      onClick={() => onClick(day)}
      style={{
        backgroundColor: isSelected ? 'var(--primary-color)' : 'var(--background-color)',
        color: isSelected ? 'var(--background-color)' : 'var(--primary-color)',
        border: '2px solid var(--primary-color)',
        padding: '10px',
        textAlign: 'center',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: isToday ? '0 0 0 3px var(--primary-color)' : 'none',
        transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60px'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'var(--primary-color)';
        e.currentTarget.style.color = 'var(--background-color)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = isSelected ? 'var(--primary-color)' : 'var(--background-color)';
        e.currentTarget.style.color = isSelected ? 'var(--background-color)' : 'var(--primary-color)';
      }}
    >
      <div>{day}</div>
      {typeof total === 'number' && total !== 0 && (
        <div style={{ fontSize: '12px', color: total >= 0 ? 'green' : 'red' }}>
          {total >= 0 ? '+' : '-'}${Math.abs(total).toFixed(2)}
        </div>
      )}
    </div>
  );
}