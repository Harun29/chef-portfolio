import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../config/firebase";

const Food = () => {

  const [downloadUrl, setDownloadUrl] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadingLink = "/cooking_loader_2.gif";

  const loadingCounter = [1, 2, 3, 4, 5]

  useEffect(() => {

    async function fetchData() {
      const recipeRef = collection(db, 'recepies');
      const starred = query(recipeRef, where("star", "==", "Yes"));
      const starredDoc = await getDocs(starred);
      const clickedStars = [];
      
      starredDoc.forEach((doc) => {
        const name = doc.data().imgName; 
        const id = doc.id; 
        clickedStars.push({
          name: name,
          id: id
        });
      })

      const promises = clickedStars.map(async (data) => {
        const url = await getDownloadURL(ref(storage, `images/${data.name}`));
        return {
          id: data.id,
          url: url
        };
      });
    
      const newDownloadLinks = await Promise.all(promises);
      setDownloadUrl(newDownloadLinks)
    }

    fetchData();  
  }, [])

  

  useEffect(() => {
    if (Object.keys(downloadUrl).length > 0){
      setLoading(false)
    }
  }, [downloadUrl])

  return(
    <div className="food-section 
      animate__animated 
      animate__fadeInDown 
      animate__faster">
      <div className="background-2">
        <div className="header-2">
          <h1>My recipes</h1>
        </div>
        <div className="food-pictures">

          {loading ?
            loadingCounter.map((index) => (
            <div key={index}>
              <div className="food">
                  <img src={loadingLink} alt="" />
              </div>
            </div>
            ))
          : downloadUrl.map(({id, url}) => (
            <Link key={id} to={`recipe-detail/${id}`}>
              <div className="food">
                  <img src={url} alt="" />
              </div>
            </Link>
            ))}

        </div>
        <div className="recepies-button">
          <button>
            <Link to="/recipes">All recipes</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
 
export default Food;