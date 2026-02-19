import React from "react";
import DashboardScreen from "./app/employee/dashboard";
import ApplyLeaveScreen from "./app/employee/leave/apply";
import ProfileScreen from "./app/employee/profile";
import LoginScreen from "./app/index";

export default function App() {
  const [route, setRoute] = React.useState("login");
  const [user, setUser] = React.useState(null);

  if (route === "login") {
    return (
      <LoginScreen
        onLoggedIn={(u) => {
          setUser(u);
          setRoute("dashboard");
        }}
      />
    );
  }

  if (route === "profile") {
    return <ProfileScreen user={user} onBack={() => setRoute("dashboard")} />;
  }

  if (route === "leaveApply") {
    return <ApplyLeaveScreen onBack={() => setRoute("dashboard")} />;
  }

  return (
    <DashboardScreen
      user={user}
      onNavigate={(r) => setRoute(r)}
      onLogout={() => {
        setUser(null);
        setRoute("login");
      }}
    />
  );
}

