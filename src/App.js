import { useState } from "react";

const BACKEND_URL = "https://web-production-02d30.up.railway.app";

const SECTIONS = {
  "Chem & Physics": ["Stoichiometry", "Thermodynamics", "Electrochemistry", "Kinetics", "Acids & Bases", "Fluids & Gas Laws", "Optics & Light", "Electricity & Circuits"],
  "Bio & Biochem": ["Cell Biology", "Genetics", "Metabolism", "Enzymes", "Molecular Biology", "Anatomy & Physiology"],
  "Psych & Sociology": ["Sensation & Perception", "Memory & Cognition", "Motivation", "Social Behavior", "Demographics"],
  "CARS": ["Humanities Passages", "Social Science Passages"],
};

const DAILY_GOAL = 10;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const loadQuestion = async () => {
    setLoading(true);
    setQuestion(null);
    setAnswered(false);
    setChosen(null);
    try {
      const res = await fetch(`${BACKEND_URL}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedTopic, section: selectedSection }),
      });
      const data = await res.json();
      setQuestion(data);
    } catch (err) {
      setQuestion({ error: true });
    }
    setLoading(false);
  };

  const selectAnswer = (idx) => {
    if (answered) return;
    setAnswered(true);
    setChosen(idx);
    const isCorrect = idx === question.correct_index;
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    if (isCorrect) setCorrect(c => c + 1);
    if (newCount >= DAILY_GOAL) {
      setStreak(s => s + 1);
      setCelebrating(true);
    }
  };

  if (celebrating) return (
    <div style={styles.celebrate}>
      <div style={styles.celebrateInner}>
        <div style={{ fontSize: "4rem" }}>🎉</div>
        <div style={styles.celebrateTitle}>Daily Goal Complete!</div>
        <div style={styles.celebrateSub}>{correct} out of {DAILY_GOAL} correct · Streak: {streak} day{streak !== 1 ? "s" : ""} 🔥</div>
        <button style={styles.btnPrimary} onClick={() => { setCelebrating(false); setDailyCount(0); setCorrect(0); setScreen("home"); }}>
          Done for Today
        </button>
        <button style={styles.btnSecondary} onClick={() => { setCelebrating(false); }}>
          Keep Going
        </button>
      </div>
    </div>
  );

  if (screen === "question") return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <button style={styles.back} onClick={() => setScreen("topics")}>← Back</button>
        <div style={styles.headerTitle}>Steady</div>
        <div style={styles.streakBadge}>{streak}🔥</div>
      </div>

      <div style={styles.progressWrap}>
        <div style={styles.progressLabel}>{dailyCount}/{DAILY_GOAL} today</div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${(dailyCount / DAILY_GOAL) * 100}%` }} />
        </div>
      </div>

      <div style={styles.breathe}>
        <span style={styles.breatheDot} />
        Take a breath. You know this.
      </div>

      <div style={styles.card}>
        {loading && (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <div style={styles.loadingText}>Generating your question…</div>
          </div>
        )}
        {question?.error && !loading && (
          <div style={styles.errorWrap}>
            <div>⚠️ Couldn't load question.</div>
            <button style={styles.btnPrimary} onClick={loadQuestion}>Try Again</button>
          </div>
        )}
        {question && !question.error && !loading && (
          <>
            <div style={styles.topicTag}>{selectedSection} · {selectedTopic}</div>
            <div style={styles.questionText}>{question.question}</div>
            <div style={styles.optionsGrid}>
              {question.options.map((opt, i) => {
                let bg = "#f0ede8", border = "#ddd8d0", color = "#1e1e1e";
                if (answered) {
                  if (i === question.correct_index) { bg = "#e3f0eb"; border = "#3a7d5c"; color = "#3a7d5c"; }
                  else if (i === chosen) { bg = "#f5e8e3"; border = "#b85c38"; color = "#b85c38"; }
                }
                return (
                  <button key={i} onClick={() => selectAnswer(i)} disabled={answered}
                    style={{ ...styles.optBtn, background: bg, borderColor: border, color }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={styles.explanation}>
                <div style={styles.explanationLabel}>Explanation</div>
                {question.explanation}
              </div>
            )}
          </>
        )}
      </div>

      {answered && !celebrating && (
        <button style={styles.btnPrimary} onClick={loadQuestion}>Next Question →</button>
      )}
    </div>
  );

  if (screen === "topics") return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <button style={styles.back} onClick={() => setScreen("home")}>← Back</button>
        <div style={styles.headerTitle}>Steady</div>
        <div style={styles.streakBadge}>{streak}🔥</div>
      </div>
      <div style={styles.sectionTitle}>{selectedSection}</div>
      <div style={styles.topicGrid}>
        {SECTIONS[selectedSection].map(topic => (
          <button key={topic} style={styles.topicBtn}
            onClick={() => { setSelectedTopic(topic); setScreen("question"); loadQuestion(); }}>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.homeHeader}>
        <div style={styles.logo}>Steady</div>
        <div style={styles.tagline}>MCAT prep for students who freeze on test day.</div>
      </div>

      <div style={styles.progressWrap}>
        <div style={styles.progressLabel}>{dailyCount}/{DAILY_GOAL} questions today</div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${(dailyCount / DAILY_GOAL) * 100}%` }} />
        </div>
      </div>

      <div style={styles.sectionLabel}>Choose a section</div>
      <div style={styles.sectionGrid}>
        {Object.keys(SECTIONS).map(section => (
          <button key={section} style={styles.sectionBtn}
            onClick={() => { setSelectedSection(section); setScreen("topics"); }}>
            {section}
          </button>
        ))}
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statVal}>{streak}</div>
          <div style={styles.statLabel}>Day Streak 🔥</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statVal}>{dailyCount}</div>
          <div style={styles.statLabel}>Today</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statVal}>{dailyCount > 0 ? Math.round((correct / dailyCount) * 100) + "%" : "—"}</div>
          <div style={styles.statLabel}>Accuracy</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { fontFamily: "system-ui, sans-serif", background: "#f0ede8", minHeight: "100vh", padding: "16px 16px 64px", maxWidth: 480, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#4a7c6f" },
  back: { background: "none", border: "none", color: "#4a7c6f", fontSize: "0.95rem", cursor: "pointer", fontWeight: 600, padding: "8px 0" },
  streakBadge: { fontSize: "1rem", fontWeight: 700, color: "#4a7c6f" },
  homeHeader: { textAlign: "center", marginBottom: 24 },
  logo: { fontSize: "2.8rem", fontWeight: 800, color: "#4a7c6f", letterSpacing: "-0.02em" },
  tagline: { fontSize: "0.85rem", color: "#6b6560", marginTop: 6, fontStyle: "italic", lineHeight: 1.4 },
  progressWrap: { marginBottom: 16 },
  progressLabel: { fontSize: "0.78rem", color: "#6b6560", marginBottom: 6, fontWeight: 500 },
  progressBar: { background: "#ddd8d0", borderRadius: 4, height: 8, overflow: "hidden" },
  progressFill: { height: "100%", background: "#4a7c6f", borderRadius: 4, transition: "width 0.4s ease" },
  breathe: { background: "#e0eeeb", border: "1px solid #7aab9e", borderRadius: 12, padding: "10px 16px", fontSize: "0.82rem", color: "#4a7c6f", fontWeight: 500, display: "flex", alignItems: "center", gap: 8, marginBottom: 16, lineHeight: 1.4 },
  breatheDot: { width: 8, height: 8, borderRadius: "50%", background: "#4a7c6f", display: "inline-block", flexShrink: 0 },
  card: { background: "#faf8f5", border: "1px solid #ddd8d0", borderRadius: 16, padding: "20px 16px", boxShadow: "0 2px 14px rgba(0,0,0,0.07)", marginBottom: 16, minHeight: 220 },
  topicTag: { fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a7c6f", fontWeight: 600, marginBottom: 10, fontFamily: "monospace" },
  questionText: { fontSize: "1.05rem", lineHeight: 1.6, color: "#1e1e1e", fontWeight: 500, marginBottom: 20 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  optBtn: { padding: "14px 16px", borderRadius: 12, border: "1.5px solid", fontSize: "0.88rem", cursor: "pointer", textAlign: "left", lineHeight: 1.4, fontFamily: "inherit", transition: "all 0.15s", width: "100%" },
  explanation: { background: "#e0eeeb", borderLeft: "3px solid #4a7c6f", borderRadius: 8, padding: "14px 16px", fontSize: "0.86rem", lineHeight: 1.6, color: "#1e1e1e", marginTop: 16 },
  explanationLabel: { fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#4a7c6f", fontWeight: 600, marginBottom: 6 },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, gap: 14 },
  spinner: { width: 36, height: 36, border: "3px solid #e0eeeb", borderTopColor: "#4a7c6f", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#6b6560", fontSize: "0.88rem" },
  errorWrap: { textAlign: "center", padding: "24px 12px", color: "#6b6560", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" },
  sectionLabel: { fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b6560", fontWeight: 600, marginBottom: 12 },
  sectionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 },
  sectionBtn: { padding: "20px 12px", borderRadius: 14, border: "1.5px solid #ddd8d0", background: "#faf8f5", color: "#1e1e1e", fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "center", lineHeight: 1.3 },
  sectionTitle: { fontSize: "1.4rem", fontWeight: 700, color: "#4a7c6f", marginBottom: 16 },
  topicGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
  topicBtn: { padding: "12px 18px", borderRadius: 20, border: "1.5px solid #ddd8d0", background: "#faf8f5", color: "#1e1e1e", fontSize: "0.86rem", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.3 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
  statCard: { background: "#faf8f5", border: "1px solid #ddd8d0", borderRadius: 12, padding: "14px 8px", textAlign: "center" },
  statVal: { fontSize: "1.5rem", fontWeight: 700, color: "#4a7c6f", lineHeight: 1 },
  statLabel: { fontSize: "0.65rem", color: "#6b6560", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
  btnPrimary: { width: "100%", padding: "16px 20px", borderRadius: 14, border: "none", background: "#4a7c6f", color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 },
  btnSecondary: { width: "100%", padding: "16px 20px", borderRadius: 14, border: "1.5px solid #ddd8d0", background: "#faf8f5", color: "#6b6560", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  celebrate: { background: "#4a7c6f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  celebrateInner: { textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" },
  celebrateTitle: { fontSize: "2.2rem", fontWeight: 800, color: "white" },
  celebrateSub: { fontSize: "1rem", color: "#e0eeeb", lineHeight: 1.5 },
};