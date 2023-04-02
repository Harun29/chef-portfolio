import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = ({screen: bigScreen}) => {
  const [dropdown, setDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();

  const navRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [navRef]);

  const handleDropdown = () => {
    if(!bigScreen){
      setDropdown(!dropdown);
    }
  };

  const changeBackground = () => {
    if (window.scrollY >= 35){
      setIsScrolled(true);
    } else{
      setIsScrolled(false);
    }
  };

  const handleLogout = async () => {
    setError('')
    try{
      await logout()
      navigate('/')
      handleDropdown();
    } catch (err) {
      setError('Failed to logout')
      console.log(err)
      alert (error)
    }
  }

  window.addEventListener('scroll', changeBackground);

  return (
  <header 
    ref={navRef}
    className={`${isScrolled||dropdown ? 'navbar active' : 'navbar'}
    ${pathname !== '/' ? ' not-home' : ''}
    ${!isScrolled && bigScreen && (pathname === '/')  ? ' big-home' : ''}
    animate__animated 
    animate__fadeInDown 
    animate__faster`}>
      <div className="name">
        <h2>Eldar K.</h2>
      </div>

      {!bigScreen ? 
      <div className="menu-dropdown">
        <button onClick={handleDropdown}>
          {!dropdown ? (
          
          <AnimatePresence>
            <motion.div
              animate={{rotate: dropdown ? 360 : 0}}>
              <FontAwesomeIcon icon={faBars} size="xl" />
            </motion.div>
          </AnimatePresence>
          )
          : (
          <AnimatePresence>
            <motion.div
              animate={{rotate: dropdown ? 360 : 0}}>
              <FontAwesomeIcon icon={faArrowUp} size="xl" />
            </motion.div>
          </AnimatePresence>
          )}
        </button> 
      </div> : null}

    {dropdown||bigScreen ? (
      <nav 
        className="dropdown
        animate__animated 
        animate__fadeInDown 
        animate__faster">
  
        <div className="navigation">
          <Link to="/">
            <button onClick={handleDropdown}>Home</button>
          </Link>
        </div>
        
        <div className="navigation">
          <Link to="/about">
            <button onClick={handleDropdown}>About me</button>
          </Link>
        </div>
        
        <div className="navigation">
          <Link to="/recepies">
            <button onClick={handleDropdown}>Recipes</button>
          </Link>
        </div>

        {currentUser ? 
          <div className="navigation">
            <Link to="/add-recepies">
              <button onClick={handleDropdown}>Add Recepies</button>
            </Link>
          </div> 
        : null}

        {currentUser ? 
          <div className="navigation">
            <button onClick={handleLogout}>Logout</button>
          </div> 
        : null}
      </nav>
    ) : null}
  </header>
  );
}
 
export default Navbar;