import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

const Recepies = () => {

  const [clickedStars, setClickedStars] = useState([]);
  const [recepies, setRecepies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState('')
  const [docToDelete, setDocToDelete] = useState()

  const {currentUser} = useAuth();

  const loadingLink = "/cooking_loader_2.gif";
  const loadingCounter = [1, 2, 3, 4, 5, 6]

  // const listRef = ref(storage, 'images/');


  // const imgNames = []
  // const currentImagesNames = []

  useEffect(() => {
    async function fetchData() {
      const usersRef = collection(db, 'recepies');
      const querySnapshot = await getDocs(usersRef);
      const promises = querySnapshot.docs.map(async (doc) => {
        const recepie = doc.data();
        const url = await getDownloadURL(ref(storage, `images/${recepie.imgName}`));
        return {
          id: doc.id,
          title: recepie.title,
          shortDescription: recepie.sdescription,   
          imageURL: url,
          imageName: recepie.imgName
        };
      });
      const recepieSnapshot = await Promise.all(promises);
      setRecepies(recepieSnapshot);
    }
    
    fetchData();
  }, [])

  useEffect(() => {
    if (Object.keys(recepies).length > 0){
      setLoading(false)
    }
  }, [recepies])

  // useEffect(() => {
  //   recepies.forEach((recepie) => {
  //     currentImagesNames.push(recepie.imageName)
  //   })
  // }, [recepies])

  // useEffect(() => {
  //   imgNames.forEach((imgName) => {
  //     if(!(currentImagesNames.contains(imgName))){
  //       deleteObject(storage, imgName)
  //     }
  //   })
  // }, [currentImagesNames])

  // useEffect(() => {
  //   listAll(listRef)
  //     .then((res) => {
  //       res.items.forEach((itemRef) => {
  //         console.log(itemRef.name)
  //         imgNames.push(itemRef.name)
  //       });
  //     }).catch((error) => {
  //       console.error(error)
  //     });
  //     console.log("img names: ", imgNames)
  // }, [])

  const handleConfirm = (id) => {
    setIdToDelete(id);
    setConfirmDelete(true);
    setDocToDelete(doc(db, 'recepies', idToDelete))
  }

  const handleDelete = async () => {
    try{
      await deleteDoc(docToDelete)
      setConfirmDelete(false)
      setRecepies(recepies.filter((item) => item.id !== idToDelete))
    }catch(error){
      console.error(error)
    }
  }

  const handleStar = (id) => {
    const docRef = doc(db, "recepies", id);
    if (clickedStars.includes(id)) {
      setClickedStars(clickedStars.filter((starId) => starId !== id));
      updateDoc(docRef, { star: "No" });
    } else {
      setClickedStars([...clickedStars, id]);
      updateDoc(docRef, { star: "Yes" });
    }
  };  

  useEffect(() => {
    async function fetchData() {
      const recipeRef = collection(db, 'recepies');
      const starred = query(recipeRef, where("star", "==", "Yes"));
      const starredDoc = await getDocs(starred);

      const newClickedStars = [...clickedStars];

      starredDoc.forEach((doc) => {
        newClickedStars.push(doc.id);
      })

      setClickedStars(newClickedStars);
    }
    fetchData()
  }, [clickedStars])

  return(
    <div className="recepies">
    {confirmDelete ? 
    <div className="dimmed-background"></div>
    : null}

    {loading ? 
      loadingCounter.map((index) => (
      <div key={index} className="recepie">
        <img src={loadingLink} alt="" />
      </div>
      ))
    : recepies.map(({id, title, shortDescription, imageURL}) => (  
        <div className={currentUser ? "recepie loged" : "recepie"} key={id}>
          <Link to={`/recipe-detail/${id}`} className={!currentUser ? "recipe-link" : ''}>
            <img src={imageURL} alt="food" />
            <div className="description">
              <h4>{title}</h4>
              <p>{shortDescription}</p>
            </div>
          </Link>

          {currentUser ?
          <div className="admin-buttons"> 
            <button onClick={() => handleConfirm(id)}>
              <FontAwesomeIcon icon={faTrash} size="xl" />
            </button>
            <button onClick={() => handleStar(id)}
                    className={clickedStars.includes(id) ? "clicked" : ""}
            >
              <FontAwesomeIcon icon={faStar} size="xl"></FontAwesomeIcon>
            </button>
          </div>
          : null}

          {confirmDelete ? 
            <div className="confirm-delete">
              <h4>Jesi li siguran da zelis izbrisati ovaj recept?</h4>
              <div className="confirm-buttons">
                <button onClick={handleDelete}>
                  Da
                </button>
                <button onClick={() => setConfirmDelete(false)}>
                  Ne
                </button>
              </div>
            </div>
          : null}
        </div>
    ))}
  </div>
  )
}
 
export default Recepies;