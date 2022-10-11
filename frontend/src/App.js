import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/shared/Header";
import HomeGuest from "./components/pages/HomeGuest";
import Footer from "./components/shared/Footer";
import Home from "./components/pages/Home";
import UserManagement from "./components/pages/UserManagement";

function App() {
  return (
    <>
      <Router>
        <div className="container">
        <Header />
          <Routes>
            <Route path='/' element={<HomeGuest/>} />
            <Route path='/users' element={<UserManagement/>} /> 
          </Routes>
        <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
