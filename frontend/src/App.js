import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/shared/Header";
import Home from "./components/pages/Home";
import Footer from "./components/shared/Footer";

function App() {
  return (
    <>
      <Router>
        <div className="container">
        <Header />
          <Routes>
            <Route path='/' element={<Home/> }/>
          </Routes>
        <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
