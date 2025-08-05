import PendingBets from './PendingBets';
import LogBetModal from './LogBetModal';

export default function Home({ pendingBets, setPendingBets, setShowLogModal }) {
  return (
    <>
      <PendingBets pendingBets={pendingBets} />
      {/* If you want to use modal from here too: */}
      {/* <LogBetModal setPendingBets={setPendingBets} onClose={() => setShowLogModal(false)} /> */}
    </>
  );
}