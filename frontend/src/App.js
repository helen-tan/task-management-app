import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'

// Components
import Header from "./components/shared/Header";
import HomeGuest from "./components/pages/HomeGuest";
import Footer from "./components/shared/Footer";
import Home from "./components/pages/Home";
import UserManagement from "./components/pages/UserManagement";
import Profile from "./components/pages/Profile";
import PrivateRoute from "./components/utils/PrivateRoute";

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("token")))

  return (
    <Router>
      <div className="container">
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
        <Routes>
          <Route path='/' element={ loggedIn ? <Home /> : <HomeGuest setLoggedIn={setLoggedIn}/>} />
         
          {/* Routes that require login */}
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/usermanagement' element={<UserManagement/>} /> 
            <Route path='/profile' element={<Profile/>} /> 
          </Route>

          
        </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
