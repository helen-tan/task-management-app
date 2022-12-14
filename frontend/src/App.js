import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from "./components/shared/Header";
import Login from "./components/pages/Login";
import Footer from "./components/shared/Footer";
import Dashboard from "./components/pages/Dashboard";
import UserManagement from "./components/admin/UserManagement";
import Profile from "./components/pages/Profile";
import Kanban from "./components/pages/Kanban";
import PrivateRoute from "./components/utils/PrivateRoute";
import NotFound from "./components/pages/NotFound";

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("token")))
  // const [loggedInUser, setLoggedInUser] = useState() //doesn not persists on refresh in child components

  return (
    <>
      <Router>
        <div className="container">
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>

          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Login setLoggedIn={setLoggedIn}/>} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile/:username' element={<Profile />} />
              <Route path='/usermanagement' element={<UserManagement />} />
              <Route path='/application/:app_acronym' element={<Kanban/>}/>
              <Route path='/*' element={<NotFound />} /> {/*A catch all - if user goes to any route that doesn't exist */}
            </Route>

          </Routes>
        
        </div>
      </Router>

      <ToastContainer/>
    </>
  );
}

export default App;
