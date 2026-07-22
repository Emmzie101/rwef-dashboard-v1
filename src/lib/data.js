import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";

/* ---------- Members ---------- */

export function subscribeMembers(cb, onError) {
  return onSnapshot(
    collection(db, "members"),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeMembers failed:", err);
      onError?.(err);
    }
  );
}

// Adds a placeholder member (no login) — e.g. an occasional volunteer who
// won't be registering their own account but still needs to be assignable.
export async function addPlaceholderMember(name, title) {
  await addDoc(collection(db, "members"), {
    name,
    title: title || "Occasional member",
    uid: null,
    role: "associate",
    placeholder: true,
    createdAt: serverTimestamp(),
  });
}

export async function updateMemberRole(memberId, role) {
  await updateDoc(doc(db, "members", memberId), { role });
}

/* ---------- Programs ---------- */

export function subscribePrograms(cb, onError) {
  return onSnapshot(
    collection(db, "programs"),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribePrograms failed:", err);
      onError?.(err);
    }
  );
}

export async function addProgram(name, color) {
  await addDoc(collection(db, "programs"), { name, color, createdAt: serverTimestamp() });
}

/* ---------- Tasks ---------- */

export function subscribeTasks(cb, onError) {
  return onSnapshot(
    collection(db, "tasks"),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeTasks failed:", err);
      onError?.(err);
    }
  );
}

export async function addTask(task) {
  await addDoc(collection(db, "tasks"), {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function patchTask(id, patch) {
  await updateDoc(doc(db, "tasks", id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteTask(id) {
  await deleteDoc(doc(db, "tasks", id));
}

/* ---------- Task comments (subcollection) ---------- */

export function subscribeComments(taskId, cb) {
  const q = query(collection(db, "tasks", taskId, "comments"), orderBy("ts", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addComment(taskId, authorId, authorName, text) {
  await addDoc(collection(db, "tasks", taskId, "comments"), {
    authorId,
    authorName,
    text,
    ts: serverTimestamp(),
  });
}

/* ---------- Live team chat ---------- */

export function subscribeChat(cb, max = 200, onError) {
  const q = query(collection(db, "chat"), orderBy("ts", "asc"), limit(max));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeChat failed:", err);
      onError?.(err);
    }
  );
}

export async function sendChatMessage(authorId, authorName, text) {
  await addDoc(collection(db, "chat"), {
    authorId,
    authorName,
    text,
    ts: serverTimestamp(),
  });
}

/* ---------- Member profile creation / self-repair ---------- */
// Used both at registration time and as a repair path for accounts that
// somehow ended up signed in without a matching member profile.
export async function createMemberProfile(uid, name, title) {
  let role = "associate";
  try {
    const existing = await getDocs(query(collection(db, "members"), limit(1)));
    role = existing.empty ? "admin" : "associate";
  } catch (e) {
    // If this check fails for any reason, fall back to the safe default
    // (associate) rather than blocking profile creation entirely.
  }
  await setDoc(doc(db, "members", uid), {
    name,
    title: title || "Team Member",
    uid,
    role,
    placeholder: false,
    createdAt: serverTimestamp(),
  });
  return role;
}
