import { useState } from "react";

const BACKEND_URL = "https://23ae061f-22af-4e96-a130-3b1f95ecd33c-00-1si8464307oa4.janeway.replit.dev:3000";

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
  wrap: { fontFamily: "system-ui, sans-serif", background: "#f0ede8", minHeight: "100vh", padding: "20px 16px 48px", maxWidth: 480, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: "1.2rem", fontWeight: 700, color: "#4a7c6f" },
  back: { background: "none", border: "none", color: "#4a7c6f", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600 },
  streakBadge: { fontSize: "1rem", fontWeight: 700, color: "#4a7c6f" },
  homeHeader: { textAlign: "center", marginBottom: 28 },
  logo: { fontSize: "2.5rem", fontWeight: 800, color: "#4a7c6f", letterSpacing: "-0.02em" },
  tagline: { fontSize: "0.88rem", color: "#6b6560", marginTop: 6, fontStyle: "italic" },
  progressWrap: { marginBottom: 20 },
  progressLabel: { fontSize: "0.78rem", color: "#6b6560", marginBottom: 6, fontWeight: 500 },
  progressBar: { background: "#ddd8d0", borderRadius: 4, height: 6, overflow: "hidden" },
  progressFill: { height: "100%", background: "#4a7c6f", borderRadius: 4, transition: "width 0.4s ease" },
  breathe: { background: "#e0eeeb", border: "1px solid #7aab9e", borderRadius: 12, padding: "9px 16px", fontSize: "0.8rem", color: "#4a7c6f", fontWeight: 500, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  breatheDot: { width: 7, height: 7, borderRadius: "50%", background: "#4a7c6f", display: "inline-block", animation: "breathe 4s ease-in-out infinite", flexShrink: 0 },
  card: { background: "#faf8f5", border: "1px solid #ddd8d0", borderRadius: 16, padding: 24, boxShadow: "0 2px 14px rgba(0,0,0,0.07)", marginBottom: 16, minHeight: 200 },
  topicTag: { fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a7c6f", fontWeight: 600, marginBottom: 10, fontFamily: "monospace" },
  questionText: { fontSize: "1rem", lineHeight: 1.55, color: "#1e1e1e", fontWeight: 500, marginBottom: 16 },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  optBtn: { padding: "10px 12px", borderRadius: 10, border: "1.5px solid", fontSize: "0.81rem", cursor: "pointer", textAlign: "left", lineHeight: 1.35, fontFamily: "inherit", transition: "all 0.15s" },
  explanation: { background: "#e0eeeb", borderLeft: "3px solid #4a7c6f", borderRadius: 8, padding: "12px 14px", fontSize: "0.84rem", lineHeight: 1.6, color: "#1e1e1e", marginTop: 14 },
  explanationLabel: { fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#4a7c6f", fontWeight: 600, marginBottom: 5 },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, gap: 14 },
  spinner: { width: 32, height: 32, border: "3px solid #e0eeeb", borderTopColor: "#4a7c6f", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#6b6560", fontSize: "0.85rem" },
  errorWrap: { textAlign: "center", padding: "24px 12px", color: "#6b6560", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" },
  sectionLabel: { fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b6560", fontWeight: 600, marginBottom: 10 },
  sectionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 },
  sectionBtn: { padding: "16px 12px", borderRadius: 14, border: "1.5px solid #ddd8d0", background: "#faf8f5", color: "#1e1e1e", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "center" },
  sectionTitle: { fontSize: "1.4rem", fontWeight: 700, color: "#4a7c6f", marginBottom: 16 },
  topicGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  topicBtn: { padding: "8px 16px", borderRadius: 20, border: "1.5px solid #ddd8d0", background: "#faf8f5", color: "#1e1e1e", fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
  statCard: { background: "#faf8f5", border: "1px solid #ddd8d0", borderRadius: 12, padding: "12px 8px", textAlign: "center" },
  statVal: { fontSize: "1.4rem", fontWeight: 700, color: "#4a7c6f", lineHeight: 1 },
  statLabel: { fontSize: "0.65rem", color: "#6b6560", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
  btnPrimary: { width: "100%", padding: "14px 20px", borderRadius: 12, border: "none", background: "#4a7c6f", color: "white", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 },
  btnSecondary: { width: "100%", padding: "14px 20px", borderRadius: 12, border: "1.5px solid #ddd8d0", background: "#faf8f5", color: "#6b6560", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  celebrate: { background: "#4a7c6f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  celebrateInner: { textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" },
  celebrateTitle: { fontSize: "2rem", fontWeight: 800, color: "white" },
  celebrateSub: { fontSize: "1rem", color: "#e0eeeb" },
};