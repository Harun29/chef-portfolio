import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../config/firebase";

const Food = () => {

  const [downloadUrl, setDownloadUrl] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadingLink = "/cooking_loader_2.gif";

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
            {downloadUrl.map(({id, url}) => (
              <Link key={id} to={`recepie-detail/${id}`}>
                <div className="food">
                    <img src={loading ? loadingLink : url} alt="" />
                </div>
              </Link>
            ))}
          </div>
          <div className="recepies-button">
            <button>
              <Link to="/recepies">All recipes</Link>
            </button>
          </div>
        </div>
      </div>
    )
}
 
export default Food;