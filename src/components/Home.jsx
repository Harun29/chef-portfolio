import { Link } from "react-router-dom";
import Food from "./home/Food";
import Experience from "./home/Experience";
import { useState, useEffect } from "react";


const Home = ({screen: bigScreen}) => {

  const [showImg, setShowImg] = useState(true);

  window.addEventListener('resize', function() {
    let width = window.innerWidth;
    if (width > 760) {
      setShowImg(true)
    } else {
      setShowImg(false)
    }
  }, true);

  useEffect(() => {
    let width = window.innerWidth;
    if (width > 760) {
      setShowImg(true)
    } else {
      setShowImg(false)
    }
  }, [])

  return (  
    <main>
        <div 
        className="welcome
        animate__animated 
        animate__fadeInDown 
        animate__faster">

          {bigScreen && showImg ? 
            <img className="home-picture" src="https://firebasestorage.googleapis.com/v0/b/eldar-portfolio.appspot.com/o/WhatsApp%20Image%202023-02-23%20at%2019.00.41.jpg?alt=media&token=2735b4f1-2929-41ab-87a3-7757e7150dd8" alt="Eldo" />
          : null}
          <div className="intro">
            <div className="greeting">
              <h1>Hello,</h1>
            </div>
            <h2>I'm <span>Chef</span> Eldar</h2>
            <p>I am a chef specializing in Italian and Mediterranean cuisine. I have perfected my skills in making pizzas and pastas, and have worked exclusively in high-end hotels. My portfolio showcases my ability to create visually stunning and delicious dishes using only the freshest ingredients.</p>
            <div className="first-button">
              <Link to="/about"><button>About me</button></Link>
            </div>
          </div>
        </div>

      <Food />

      <Experience />
    </main>
  );
}
 
export default Home;