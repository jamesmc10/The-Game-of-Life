import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const defaultState = {
  stats: {
    STRENGTH: { value: 62, color: "#ef4444", desc: "Physical output & body composition" },
    DISCIPLINE: { value: 71, color: "#f59e0b", desc: "Routine adherence & self-control" },
    ENERGY: { value: 68, color: "#22c55e", desc: "Vitality, sleep & recovery quality" },
    CONFIDENCE: { value: 58, color: "#3b82f6", desc: "Self-belief in high-stakes moments" },
    INFLUENCE: { value: 45, color: "#a855f7", desc: "Persuasion, leadership & presence" },
    WEALTH: { value: 32, color: "#f59e0b", desc: "Income, savings & financial leverage" },
    LEVERAGE: { value: 28, color: "#06b6d4", desc: "Systems, brand & assets working for you" },
    EXECUTION: { value: 65, color: "#f97316", desc: "Turning plans into real results" },
    RESILIENCE: { value: 70, color: "#84cc16", desc: "Consistency under pressure" },
    SOCIAL: { value: 44, color: "#ec4899", desc: "Network quality & social effectiveness" }
  },
  quests: [
    { id: 1, title: "Complete morning routine", cat: "NON-NEG", xp: 50, stat: "DISCIPLINE", completed: false },
    { id: 2, title: "Gym session — strength focus", cat: "BODY", xp: 80, stat: "STRENGTH", completed: false },
    { id: 3, title: "Send 1 outreach / cold message", cat: "MONEY", xp: 120, stat: "WEALTH", completed: false },
    { id: 4, title: "60-min deep work block", cat: "MONEY", xp: 100, stat: "EXECUTION", completed: false },
    { id: 5, title: "Cardio or conditioning work", cat: "BODY", xp: 60, stat: "ENERGY", completed: false },
    { id: 6, title: "Learn 1 commercial skill (30 min)", cat: "GROWTH", xp: 50, stat: "LEVERAGE", completed: false },
    { id: 7, title: "Meaningful social interaction", cat: "SOCIAL", xp: 70, stat: "SOCIAL", completed: false },
    { id: 8, title: "Plan tomorrow's 3 key moves", cat: "NON-NEG", xp: 40, stat: "DISCIPLINE", completed: false },
    { id: 9, title: "Test / explore one opportunity", cat: "EXPLORE", xp: 90, stat: "LEVERAGE", completed: false },
    { id: 10, title: "Sales pitch or practice call", cat: "MONEY", xp: 150, stat: "INFLUENCE", completed: false }
  ],
  fatigue: 28,
  totalXP: 1240,
  review: {
    wins: "",
    cuts: "",
    money: "",
    body: "",
    nextFocus: ""
  }
};

function appStateRef(uid) {
  return doc(db, "users", uid, "appState", "main");
}

export async function ensureUserState(uid) {
  const ref = appStateRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      ...defaultState,
      updatedAt: serverTimestamp()
    });
    return defaultState;
  }

  return snap.data();
}

export async function saveUserState(uid, state) {
  const ref = appStateRef(uid);

  await setDoc(
    ref,
    {
      ...state,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeToUserState(uid, callback) {
  const ref = appStateRef(uid);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
}
