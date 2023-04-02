import { useState } from "react";

const About = ({screen: bigScreen}) => {

  const [zoomPicture, setZoomPicture] = useState(false)

  const handleZoom = () => {
    if(!bigScreen){
      setZoomPicture(!zoomPicture)
    }
  }

  return (
    <main className="about
    animate__animated 
    animate__fadeInDown 
    animate__faster">
      <div className={`profile-picture${zoomPicture ? " active" : ""}`} onClick={handleZoom}>
        <img src="https://firebasestorage.googleapis.com/v0/b/eldar-portfolio.appspot.com/o/WhatsApp%20Image%202023-02-23%20at%2019.00.41.jpg?alt=media&token=2735b4f1-2929-41ab-87a3-7757e7150dd8" alt="Eldo" />
      </div>
      <div className="about-me">
        <p>As a chef and master of Italian and Mediterranean cuisine, I have honed my skills in creating delectable pizzas and pastas. With experience in high-end hotels, I have developed a keen understanding of the nuances of creating exquisite dishes that delight even the most discerning palates. My portfolio showcases my ability to create delicious, visually stunning meals that are a feast for both the eyes and the taste buds. My passion for cooking is matched only by my dedication to excellence, and I take pride in using only the finest, freshest ingredients to craft dishes that are both innovative and timeless.</p>
      </div>
      {/* <div className="first-button">
        <button>
          Request my cv
        </button>
      </div> */}
    </main>
  );
}
 
export default About;