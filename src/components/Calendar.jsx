import CalendarDay from './CalendarDay';
import { useState } from 'react';
import DayMessage from './DayMessage';

export default function Calendar() {
  const now = new Date();
  const today = now.getDate();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleDayClick = (day) => setSelectedDay(day);
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const isCurrentMonth =
    currentYear === now.getFullYear() && currentMonth === now.getMonth();

  return (
    <div style={{
      height: 'calc(100vh - 117px)',
      overflowY: 'auto'
    }}>
      <div className="calendar-container">
        <div className="calendar-header">
          <button
            onClick={handlePrevMonth}
            className="calendar-nav-button"
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--background-color)"
            }}
          >&lt;</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <h2
              className="calendar-month-title"
              style={{ color: "var(--primary-color)" }}
            >
              {monthNames[currentMonth]} {currentYear}
            </h2>
            {(() => {
              const settledBets = JSON.parse(localStorage.getItem("settledBets") || "[]");
              const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
              const betsThisMonth = settledBets.filter(bet => bet.date.startsWith(currentMonthKey));
              const profit = betsThisMonth.reduce((acc, bet) => {
                return acc + (bet.won ? Number(bet.payout) : -Number(bet.risk));
              }, 0);
              const profitColor = profit > 0 ? 'green' : (profit < 0 ? 'red' : 'inherit');
              return (
                <div style={{ color: profitColor, marginLeft: '12px', fontSize: '1rem', fontWeight: 'bold' }}>
                  {profit !== 0 && (profit > 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`)}
                </div>
              );
            })()}
          </div>
          {!isCurrentMonth && (
            <button
              onClick={handleNextMonth}
              className="calendar-nav-button"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--background-color)"
              }}
            >&gt;</button>
          )}
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 60px)",
          justifyContent: "center",
          gap: "16px",
          fontSize: "1.1rem",
          marginBottom: "24px"
        }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--primary-color)"
              }}
            >
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            return (
              <CalendarDay
                key={day}
                day={day}
                month={currentMonth + 1}
                year={currentYear}
                isSelected={selectedDay === day}
                isToday={
                  day === today &&
                  currentMonth === now.getMonth() &&
                  currentYear === now.getFullYear()
                }
                onClick={handleDayClick}
              />
            );
          })}
        </div>
        {selectedDay && (
          <div style={{ marginTop: "12px", textAlign: "center", fontSize: "1.2rem", color: "var(--primary-color)" }}>
            <h3>{monthNames[currentMonth]} {selectedDay}</h3>
            {(() => {
              const settledBets = JSON.parse(localStorage.getItem("settledBets") || "[]");
              const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
              const betsForDay = settledBets.filter(bet => bet.date === selectedDate);
              if (betsForDay.length === 0) return <p>No bets on this day.</p>;
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  justifyContent: 'center',
                  alignItems: 'start',
                  padding: '0 20px',
                  width: '100%',
                  marginTop: '20px',
                  paddingBottom: '100px'
                }}>
                  {betsForDay.map((bet, i) => <DayMessage key={i} bet={bet} />)}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}