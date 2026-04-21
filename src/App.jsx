import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AuthScreen from "./AuthScreen";
import AppShell from "./AppShell";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });

    return () => unsub();
  }, []);

  if (checkingAuth) {
    return <div style={{ color: "white", padding: 24, background: "#07070a", minHeight: "100vh" }}>Checking login...</div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <AppShell user={user} />;
}
