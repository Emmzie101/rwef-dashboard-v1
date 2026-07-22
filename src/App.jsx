import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import AllTasksTable from "./components/AllTasksTable.jsx";
import TeamView from "./components/TeamView.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import TaskFormModal from "./components/TaskFormModal.jsx";
import TaskDetailModal from "./components/TaskDetailModal.jsx";
import { AddMemberModal, AddProgramModal } from "./components/SmallModals.jsx";
import CompleteProfileScreen from "./components/CompleteProfileScreen.jsx";
import ManageTeamModal from "./components/ManageTeamModal.jsx";
import { canManageMembers, canManagePrograms } from "./lib/permissions.js";
import {
  subscribeMembers,
  subscribePrograms,
  subscribeTasks,
  addTask,
  patchTask,
  deleteTask,
  addProgram,
  addPlaceholderMember,
} from "./lib/data.js";
import { C } from "./theme.js";
import { RWEFIcon } from "./components/ui.jsx";

function Shell() {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [view, setView] = useState("all"); // all | mine | person:<id> | program:<id> | chat
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showManageTeam, setShowManageTeam] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!user) return;
    const u1 = subscribeMembers(
      (list) => {
        setMembers(list);
        setMembersLoaded(true);
      },
      () => setDataError("Couldn't load the team list — try refreshing.")
    );
    const u2 = subscribePrograms(setPrograms, () => setDataError("Couldn't load programs — try refreshing."));
    const u3 = subscribeTasks(setTasks, () => setDataError("Couldn't load tasks — try refreshing."));
    return () => {
      u1();
      u2();
      u3();
    };
  }, [user]);

  const me = useMemo(() => members.find((m) => m.uid === user?.uid), [members, user]);

  const memberById = useMemo(() => {
    const m = {};
    members.forEach((mm) => (m[mm.id] = mm));
    return m;
  }, [members]);

  const programById = useMemo(() => {
    const p = {};
    programs.forEach((pp) => (p[pp.id] = pp));
    return p;
  }, [programs]);

  const personProgramIds = useCallback(
    (personId) => {
      const set = new Set();
      tasks.forEach((t) => {
        if (t.ownerId === personId || t.shadowId === personId) set.add(t.programId);
      });
      return [...set];
    },
    [tasks]
  );

  const personStats = useCallback(
    (personId) => {
      const mine = tasks.filter((t) => t.ownerId === personId || t.shadowId === personId);
      const done = mine.filter((t) => t.status === "done").length;
      const overdue = mine.filter((t) => {
        if (!t.deadline || t.status === "done") return false;
        return new Date(t.deadline + "T00:00:00") < new Date(new Date().toDateString());
      }).length;
      return { total: mine.length, done, overdue, pct: mine.length ? Math.round((done / mine.length) * 100) : 0 };
    },
    [tasks]
  );

  let visibleTasks = tasks;
  let heading = "All tasks";
  if (view === "mine" && me) {
    visibleTasks = tasks.filter((t) => t.ownerId === me.id || t.shadowId === me.id);
    heading = "My tasks";
  } else if (view.startsWith("person:")) {
    const pid = view.split(":")[1];
    visibleTasks = tasks.filter((t) => t.ownerId === pid || t.shadowId === pid);
    heading = memberById[pid]?.name ? `${memberById[pid].name}'s tasks` : "Tasks";
  } else if (view.startsWith("program:")) {
    const pid = view.split(":")[1];
    visibleTasks = tasks.filter((t) => t.programId === pid);
    heading = programById[pid]?.name || "Program";
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    visibleTasks = visibleTasks.filter((t) => t.title.toLowerCase().includes(q));
  }

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  // Signed in, member list has loaded, but no matching profile exists yet —
  // this happens if profile creation failed partway through at registration.
  if (membersLoaded && user && !me) {
    return <CompleteProfileScreen uid={user.uid} suggestedName={user.displayName} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {dataError && (
        <div style={{ background: C.rustTint, color: C.rust, textAlign: "center", fontSize: 12.5, padding: "8px 12px" }}>
          {dataError}
        </div>
      )}
      <TopBar
        me={me}
        search={search}
        setSearch={setSearch}
        onNewTask={() => setShowAddTask(true)}
        onToggleMobileNav={() => setMobileNavOpen((v) => !v)}
      />

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Sidebar
          className={`rwef-sidebar ${mobileNavOpen ? "open" : ""}`}
          view={view}
          setView={(v) => {
            setView(v);
            setMobileNavOpen(false);
          }}
          members={members}
          programs={programs}
          personStats={personStats}
          personProgramIds={personProgramIds}
          onAddMember={() => setShowAddMember(true)}
          onAddProgram={() => setShowAddProgram(true)}
          onManageTeam={() => setShowManageTeam(true)}
          canManageMembers={canManageMembers(me)}
          canManagePrograms={canManagePrograms(me)}
        />

        <div className="rwef-main" style={{ flex: 1, padding: "22px 26px 60px", minWidth: 0 }}>
          {view === "chat" ? (
            <ChatPanel me={me} members={members} />
          ) : view === "team" ? (
            <TeamView members={members} personStats={personStats} setView={setView} />
          ) : (
            <AllTasksTable
              heading={heading}
              tasks={visibleTasks}
              allTasks={tasks}
              members={members}
              programs={programs}
              memberById={memberById}
              programById={programById}
              onOpenTask={(id) => setActiveTaskId(id)}
              onAddTask={() => setShowAddTask(true)}
            />
          )}
        </div>
      </div>

      {showAddTask && (
        <TaskFormModal
          title="New task"
          members={members}
          programs={programs}
          onClose={() => setShowAddTask(false)}
          onSubmit={async (form) => {
            await addTask(form);
            setShowAddTask(false);
          }}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSubmit={async (name, title) => {
            await addPlaceholderMember(name, title);
            setShowAddMember(false);
          }}
        />
      )}

      {showAddProgram && (
        <AddProgramModal
          onClose={() => setShowAddProgram(false)}
          onSubmit={async (name, color) => {
            await addProgram(name, color);
            setShowAddProgram(false);
          }}
        />
      )}

      {showManageTeam && <ManageTeamModal members={members} onClose={() => setShowManageTeam(false)} />}

      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          members={members}
          programs={programs}
          me={me}
          onClose={() => setActiveTaskId(null)}
          onPatch={(patch) => patchTask(activeTask.id, patch)}
          onDelete={async () => {
            await deleteTask(activeTask.id);
            setActiveTaskId(null);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

function Gate() {
  const { user } = useAuth();
  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          flexDirection: "column",
          gap: 12,
          color: C.inkSoft,
        }}
      >
        <RWEFIcon size={32} />
        <span>Loading…</span>
      </div>
    );
  }
  if (!user) return <AuthScreen />;
  return <Shell />;
}
