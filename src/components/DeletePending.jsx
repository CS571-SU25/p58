export default function DeletePending({ bet }) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this pending bet?")) {
      const existing = JSON.parse(localStorage.getItem('pendingBets') || '[]');
      const updated = existing.filter(b => String(b.id) !== String(bet.id));
      localStorage.setItem('pendingBets', JSON.stringify(updated));
      window.location.reload();
    }
  };

  return (
  <button
  onClick={handleDelete}
  style={{
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    color: 'var(--background-color)',
    padding: '6px 12px',
    borderRadius: '66px',
    cursor: 'pointer',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px' // nudges it to align with Settle
  }}
  title="Delete Bet"
  aria-label="Delete Bet"
>
  🗑️
</button>
  );
}