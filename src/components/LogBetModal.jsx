import React, { useState } from "react";

export default function LogBetModal({ onClose, setPendingBets }) {
  const [numLegs, setNumLegs] = useState(1);
  const [legs, setLegs] = useState([
    { type: "Player Prop", playerName: "", stat: "", line: "", overUnder: "" },
  ]);
  const [totalRisk, setTotalRisk] = useState("");
  const [totalPayout, setTotalPayout] = useState("");
  const [errors, setErrors] = useState({ legs: [], risk: false, payout: false });
  const [payoutErrorMsg, setPayoutErrorMsg] = useState('');

  const handleLegChange = (index, field, value) => {
    setLegs((prevLegs) =>
      prevLegs.map((leg, i) =>
        i === index ? { ...leg, [field]: value } : leg
      )
    );
  };

  const handleNumLegsChange = (e) => {
    const newNum = parseInt(e.target.value);
    setNumLegs(newNum);
    const updatedLegs = [...legs];
    while (updatedLegs.length < newNum) {
      updatedLegs.push({ type: "Player Prop", playerName: "", stat: "", line: "", overUnder: "" });
    }
    setLegs(updatedLegs.slice(0, newNum));
  };

 const handleSave = () => {
    const newErrors = { legs: [], risk: false, payout: false };
    let hasError = false;

    legs.forEach((leg, index) => {
      const missingFields = Object.values(leg).some(v => !v);
      newErrors.legs[index] = missingFields;
      if (missingFields) hasError = true;
    });

    if (!totalRisk) {
      newErrors.risk = true;
      hasError = true;
    }

    if (!totalPayout || parseFloat(totalPayout) <= parseFloat(totalRisk)) {
      newErrors.payout = true;
      setPayoutErrorMsg("Payout must be greater than risk");
      setTotalPayout(""); // clear the field
      hasError = true;
    } else {
      setPayoutErrorMsg('');
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const bet = {
      id: Date.now(),
      legs,
      risk: totalRisk,
      payout: totalPayout,
    };
    setPendingBets(prev => {
      const updated = [...prev, bet];
      console.log("Updated pending bets:", updated); // ✅ see what's saved
      return updated;
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2>Log Parlay</h2>

        <label style={{ color: 'var(--primary-color)' }}>Number of Legs:</label>
        <select value={numLegs} onChange={handleNumLegsChange} style={{ color: 'var(--primary-color)' }}>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        {legs.map((leg, index) => (
          <div key={index} style={{ marginTop: "1rem", padding: "1rem", border: "1px solid var(--primary-color)", borderRadius: "6px" }}>
            <p><strong style={{ color: 'var(--primary-color)' }}>Leg {index + 1}</strong></p>
            <input
              type="text"
              placeholder="Player Name"
              value={leg.playerName}
              onChange={(e) => handleLegChange(index, "playerName", e.target.value)}
              style={{
                color: leg.playerName ? 'var(--primary-color)' : undefined,
                border: errors.legs[index] && !leg.playerName ? '2px solid red' : undefined
              }}
            />
            <input
              type="text"
              placeholder="Line"
              value={leg.line}
              onChange={(e) => handleLegChange(index, "line", e.target.value)}
              style={{
                color: leg.line ? 'var(--primary-color)' : undefined,
                border: errors.legs[index] && !leg.line ? '2px solid red' : undefined
              }}
            />
            <select
              value={leg.stat}
              onChange={(e) => handleLegChange(index, "stat", e.target.value)}
              style={{
                color: leg.stat ? 'var(--primary-color)' : 'grey',
                border: errors.legs[index] && !leg.stat ? '2px solid red' : undefined
              }}
            >
              <option value="" disabled hidden style={{ color: errors.legs[index] ? 'red' : 'grey' }}>Stat</option>
              <option value="P">Points</option>
              <option value="R">Rebounds</option>
              <option value="A">Assists</option>
              <option value="P+R">P+R</option>
              <option value="P+A">P+A</option>
              <option value="R+A">R+A</option>
              <option value="P+R+A">P+R+A</option>
            </select>
            <select
              value={leg.overUnder}
              onChange={(e) => handleLegChange(index, "overUnder", e.target.value)}
              style={{
                color: leg.overUnder ? 'var(--primary-color)' : 'grey',
                border: errors.legs[index] && !leg.overUnder ? '2px solid red' : undefined
              }}
            >
              <option value="" disabled hidden style={{ color: errors.legs[index] ? 'red' : 'grey' }}>Over/Under</option>
              <option value="Over">Over</option>
              <option value="Under">Under</option>
            </select>
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <label style={{ color: 'red' }}>Risk:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '4px', color: 'red' }}>$</span>
            <input
              type="number"
              value={totalRisk}
              onChange={(e) => setTotalRisk(e.target.value)}
              placeholder="Enter Risk"
              style={{ flex: 1, color: 'red', border: errors.risk ? '2px solid red' : undefined }}
            />
          </div>
          <label style={{ color: 'green' }}>Payout:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '4px', color: 'green' }}>$</span>
            <input
              type="number"
              value={totalPayout}
              onChange={(e) => setTotalPayout(e.target.value)}
              placeholder={errors.payout ? payoutErrorMsg : "Enter Payout"}
              style={{
                flex: 1,
                color: errors.payout ? 'red' : 'green',
                border: errors.payout ? '2px solid red' : undefined
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", width: "100%" }}>
          <div style={{ display: "flex", width: "100%" }}>
            <button className="save-button" style={{ width: "50%" }} onClick={handleSave}>Save</button>
            <button className="close-button" style={{ width: "50%" }} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}