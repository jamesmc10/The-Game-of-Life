import { useEffect, useState } from "react";
import { ensureUserState, saveUserState, subscribeToUserState } from "./appState";
import { logoutUser } from "./auth";

const T = {
  bg: "#07070a",
  surface: "#0f0f13",
  elevated: "#16161c",
  border: "#22222c",
  accent: "#f59e0b",
  accentDim: "#f59e0b18",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  cyan: "#06b6d4",
  orange: "#f97316",
  text: "#e8e8ec",
  muted: "#64647a",
  dimmed: "#2a2a36"
};

const INITIAL_OPPS = [
  {
    id: 1,
    title: "Online Coaching (1-on-1)",
    scores: { income: 7, leverage: 6, speed: 8, fit: 9, upside: 7, excitement: 8 },
    status: "PURSUE",
    notes: "Leverages physiology + training background. Fast path to first revenue."
  },
  {
    id: 2,
    title: "High-Ticket Sales Role",
    scores: { income: 8, leverage: 5, speed: 9, fit: 8, upside: 7, excitement: 7 },
    status: "PURSUE",
    notes: "Fastest income. Sales skill compounds directly into entrepreneurship."
  },
  {
    id: 3,
    title: "Personal Brand / Content",
    scores: { income: 4, leverage: 9, speed: 3, fit: 7, upside: 10, excitement: 8 },
    status: "TEST",
    notes: "Long runway but asymmetric upside."
  }
];

const CAT_COLORS = {
  "NON-NEG": "#f59e0b",
  MONEY: "#22c55e",
  BODY: "#ef4444",
  GROWTH: "#3b82f6",
  SOCIAL: "#a855f7",
  EXPLORE: "#06b6d4"
};

const STATUS_CFG = {
  PURSUE: { bg: "#22c55e12", border: "#22c55e", text: "#22c55e", label: "PURSUE NOW" },
  TEST: { bg: "#3b82f612", border: "#3b82f6", text: "#3b82f6", label: "TEST LIGHTLY" },
  PARK: { bg: "#f59e0b12", border: "#f59e0b", text: "#f59e0b", label: "PARK FOR LATER" },
  AVOID: { bg: "#ef444412", border: "#ef4444", text: "#ef4444", label: "DISTRACTION" }
};

const TABS = [
  { id: "HQ", label: "HQ" },
  { id: "OPS", label: "OPS" },
  { id: "PROFILE", label: "STATS" },
  { id: "OPP", label: "OPP" },
  { id: "REVIEW", label: "REVIEW" }
];

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 16,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export default function AppShell({ user }) {
  const [tab, setTab] = useState("HQ");
  const [stats, setStats] = useState(null);
  const [quests, setQuests] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [totalXP, setTotalXP] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [opps] = useState(INITIAL_OPPS);

  useEffect(() => {
    let unsub = null;

    async function boot() {
      const data = await ensureUserState(user.uid);
      setStats(data.stats);
      setQuests(data.quests);
      setFatigue(data.fatigue);
      setTotalXP(data.totalXP);
      setReview(data.review);
      setHydrated(true);
      setLoading(false);

      unsub = subscribeToUserState(user.uid, (liveData) => {
        setStats(liveData.stats);
        setQuests(liveData.quests);
        setFatigue(liveData.fatigue);
        setTotalXP(liveData.totalXP);
        setReview(liveData.review);
      });
    }

    boot();

    return () => {
      if (unsub) unsub();
    };
  }, [user.uid]);

  useEffect(() => {
    if (!hydrated || !stats || !quests || fatigue === null || totalXP === null || !review) return;

    const timeout = setTimeout(() => {
      saveUserState(user.uid, {
        stats,
        quests,
        fatigue,
        totalXP,
        review
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [hydrated, user.uid, stats, quests, fatigue, totalXP, review]);

  if (loading || !stats || !quests || fatigue === null || totalXP === null || !review) {
    return <div style={{ color: "white", padding: 24, background: T.bg, minHeight: "100vh" }}>Loading app data...</div>;
  }

  const dayXP = quests.filter((q) => q.completed).reduce((s, q) => s + q.xp, 0);
  const level = Math.floor(totalXP / 500) + 1;
  const xpProgress = ((totalXP % 500) / 500) * 100;

  function completeQuest(id) {
    const quest = quests.find((q) => q.id === id && !q.completed);
    if (!quest) return;

    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: true } : q)));
    setTotalXP((prev) => prev + quest.xp);

    if (quest.stat && stats[quest.stat]) {
      setStats((prev) => ({
        ...prev,
        [quest.stat]: {
          ...prev[quest.stat],
          value: Math.min(100, prev[quest.stat].value + Math.floor(quest.xp / 20))
        }
      }));
    }

    setFatigue((prev) => Math.min(100, prev + 2));
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#07070aee",
          borderBottom: `1px solid ${T.border}`,
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10
        }}
      >
        <div>
          <div style={{ fontWeight: 900, letterSpacing: 1, color: T.accent }}>OPERATOR OS</div>
          <div style={{ fontSize: 12, color: T.muted }}>{user.email}</div>
        </div>

        <button
          onClick={logoutUser}
          style={{
            padding: "8px 12px",
            background: "transparent",
            border: `1px solid ${T.border}`,
            color: "#fff",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: 16, paddingBottom: 90 }}>
        {tab === "HQ" && (
          <div style={{ display: "grid", gap: 12 }}>
            <Card>
              <h2>Level {level}</h2>
              <p>Total XP: {totalXP}</p>
              <p>Today's XP: {dayXP}</p>
              <p>Fatigue: {fatigue}%</p>
              <div style={{ marginTop: 10, height: 8, background: T.border, borderRadius: 999 }}>
                <div
                  style={{
                    width: `${xpProgress}%`,
                    height: "100%",
                    background: T.accent,
                    borderRadius: 999
                  }}
                />
              </div>
            </Card>

            <Card>
              <h3>Stats</h3>
              {Object.entries(stats).map(([name, stat]) => (
                <div key={name} style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{name}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div style={{ height: 6, background: T.border, borderRadius: 999, marginTop: 4 }}>
                    <div
                      style={{
                        width: `${stat.value}%`,
                        height: "100%",
                        background: stat.color,
                        borderRadius: 999
                      }}
                    />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "OPS" && (
          <div style={{ display: "grid", gap: 10 }}>
            {quests.map((quest) => (
              <Card
                key={quest.id}
                style={{
                  opacity: quest.completed ? 0.6 : 1,
                  border: `1px solid ${quest.completed ? CAT_COLORS[quest.cat] : T.border}`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{quest.title}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>
                      {quest.cat} · +{quest.xp} XP · boosts {quest.stat}
                    </div>
                  </div>

                  <button
                    disabled={quest.completed}
                    onClick={() => completeQuest(quest.id)}
                    style={{
                      padding: "8px 12px",
                      background: quest.completed ? "#333" : CAT_COLORS[quest.cat],
                      border: "none",
                      color: "#fff",
                      borderRadius: 8,
                      cursor: quest.completed ? "default" : "pointer"
                    }}
                  >
                    {quest.completed ? "Done" : "Complete"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "PROFILE" && (
          <Card>
            <h3>Profile</h3>
            <p>Level: {level}</p>
            <p>Total XP: {totalXP}</p>
            <p>Fatigue: {fatigue}%</p>
          </Card>
        )}

        {tab === "OPP" && (
          <div style={{ display: "grid", gap: 10 }}>
            {opps.map((opp) => {
              const cfg = STATUS_CFG[opp.status];
              return (
                <Card key={opp.id} style={{ border: `1px solid ${cfg.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <strong>{opp.title}</strong>
                    <span style={{ color: cfg.text }}>{cfg.label}</span>
                  </div>
                  <p style={{ color: T.muted }}>{opp.notes}</p>
                </Card>
              );
            })}
          </div>
        )}

        {tab === "REVIEW" && (
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["wins", "What moved me forward?"],
              ["cuts", "What was noise?"],
              ["money", "What created money or leverage?"],
              ["body", "Physical progress this week"],
              ["nextFocus", "Next week's critical move"]
            ].map(([key, label]) => (
              <Card key={key}>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>{label}</div>
                <textarea
                  value={review[key] || ""}
                  onChange={(e) => setReview((prev) => ({ ...prev, [key]: e.target.value }))}
                  rows={4}
                  style={{
                    width: "100%",
                    background: "#111",
                    color: "#fff",
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: 12
                  }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          background: "#111",
          borderTop: `1px solid ${T.border}`
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: 14,
              background: "transparent",
              border: "none",
              color: tab === t.id ? T.accent : T.muted,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
