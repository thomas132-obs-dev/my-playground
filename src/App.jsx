import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import GameRoom from "./components/GameRoom";
import { AuthProvider } from "./states/AuthContext";

function App() {
  const user = localStorage.getItem("user");
  console.log("first", user);
  return (
    <>
      <div>Hello {user.displayName}</div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={user ? <GameRoom /> : <Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
