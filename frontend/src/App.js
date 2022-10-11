import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'

// Components
import Header from "./components/shared/Header";
import HomeGuest from "./components/pages/HomeGuest";
import Footer from "./components/shared/Footer";
import Home from "./components/pages/Home";
import UserManagement from "./components/pages/UserManagement";

function App() {
  const [loggedIn, setLoggedIn] = useState()

  return (
    <>
      <Router>
        <div className="container">
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
          <Routes>
            <Route path='/' element={<HomeGuest setLoggedIn={setLoggedIn}/>} />
            <Route path='/users' element={<UserManagement/>} /> 
          </Routes>
        <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
