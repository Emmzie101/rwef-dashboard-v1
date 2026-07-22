import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, getDocs, query, limit } from "firebase/firestore";
import { auth, db } from "../firebase.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return unsub;
  }, []);

  const register = async (name, title, email, password) => {
    setAuthError("");
    try {
      // The very first person to ever register becomes Admin (bootstrap).
      // Everyone after that starts as Associate — an Admin can promote
      // people to Lead or Admin afterward from the "Manage team" screen.
      const existing = await getDocs(query(collection(db, "members"), limit(1)));
      const role = existing.empty ? "admin" : "associate";

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "members", cred.user.uid), {
        name,
        title: title || "Team Member",
        uid: cred.user.uid,
        role,
        placeholder: false,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (e) {
      setAuthError(friendlyAuthError(e));
      return false;
    }
  };

  const login = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      setAuthError(friendlyAuthError(e));
      return false;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthCtx.Provider value={{ user, register, login, logout, authError, setAuthError }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}

function friendlyAuthError(e) {
  const code = e?.code || "";
  if (code.includes("email-already-in-use")) return "That email is already registered — try logging in instead.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "That email address doesn't look right.";
  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
    return "Email or password doesn't match our records.";
  return "Something went wrong. Please try again.";
}
