import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import About from "./components/pages/About"
import Login from "./components/admin/Login";
import Recepies from "./components/pages/Recepies";
import AddRecepie from "./components/admin/AddRecepie";
import RecepieDetail from "./components/pages/RecepieDetail";
import ResetPassword from "./components/admin/ResetPassword"

import 'animate.css';
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {

  const [bigScreen, setBigScreen] = useState(false);

  window.addEventListener('resize', function() {
    let width = window.innerWidth;
    if (width > 480) {
      setBigScreen(true)
    } else {
      setBigScreen(false)
    }
  }, true);

  useEffect(() => {
    let width = window.innerWidth;
    if (width > 480) {
      setBigScreen(true)
    } else {
      setBigScreen(false)
    }
  }, [])

  return (
    <AuthProvider>
    <Router>
      <div className="App"> 
        <Navbar screen={bigScreen}/>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home screen={bigScreen}/>} />
              <Route path="/about" element={<About screen={bigScreen} />} />
              <Route path="/admin" element={<Login />} />
              <Route path="/recepies" element={<Recepies />} />
              <Route path="/recepie-detail/:id" element={<RecepieDetail />} />
              <Route path='/add-recepies' element={<PrivateRoute component={AddRecepie} />}/>
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </div>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
