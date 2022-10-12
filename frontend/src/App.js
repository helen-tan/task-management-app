import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'

// Components
import Header from "./components/shared/Header";
import Login from "./components/pages/Login";
import Footer from "./components/shared/Footer";
import Dashboard from "./components/pages/Dashboard";
import UserManagement from "./components/pages/UserManagement";
import Profile from "./components/pages/Profile";
import PrivateRoute from "./components/utils/PrivateRoute";

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("token")))
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("admin"))

  return (
    <Router>
      <div className="container">
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} isAdmin={isAdmin} />

        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Login setLoggedIn={setLoggedIn} />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/usermanagement' element={<UserManagement />} />
          </Route>

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
