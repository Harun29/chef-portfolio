import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router";
import {
  ref,
  uploadBytes
} from "firebase/storage";
import { storage } from "../../config/firebase";
import { v4 } from "uuid";

const AddRecepie = () => {

  const [numberOfLetters, setNumberOfLetters] = useState(0)

  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const [recepie, setRecepie] = useState()

  const [imageUpload, setImageUpload] = useState(null);
  const [imgName, setImgName] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
      setImgName(file.name + v4());
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const uploadFile = async () => {
    try {
      if (imageUpload == null) return;
      const imageRef = ref(storage, `images/${imgName}`);
      await uploadBytes(imageRef, imageUpload);
    } catch (err){
      console.error('Error adding image: ', err);
    }
  };

  const addData = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'recepies'), data);
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setLoading(true);
      await uploadFile();
      await addData(recepie);
      navigate('/')
    } catch (err) {
      setError('Failed to add recepie! Error: ', err)
    }
  }

  useEffect(() => {
    setRecepie({
      title: title,
      sdescription: shortDescription,
      fdescription: fullDescription,
      imgName: imgName,
      star: "No"
    });

    setNumberOfLetters(shortDescription.length)
  }, [title, shortDescription, fullDescription, imgName])


  /* FUNCTION FOR EXPANDING TEXT AREA */
  const handleTextareaChange = (e, setFunction) => {
    setFunction(e.target.value);

    e.target.style.height = 'auto';
    e.target.style.height = `calc(${e.target.scrollHeight }px - 25px)`;
  }

  return (
    <form 
    className="
    add-recepies
    animate__animated 
    animate__fadeInDown 
    animate__faster"
    onSubmit={handleSubmit}
    >
      <h2>Dodaj recept</h2>
      <div className="add-title">
        <textarea 
        type="text"
        required
        value={title}
        placeholder="Title"
        onChange={(e) => handleTextareaChange(e, setTitle)} 
        />
      </div>
      <div className={`short-description ${numberOfLetters > 100 ? ' too-much' : ''}`}>
        <textarea
          type="text"
          required
          value={shortDescription}
          placeholder="short description"
          onChange={(e) => handleTextareaChange(e, setShortDescription)}
        />
        <div className="letter-counter">
          {numberOfLetters} / 100
        </div>
      </div>
      <div className="full-description">
        <textarea 
          type="text"
          required
          value={fullDescription}
          placeholder="full description"
          onChange={(e) => handleTextareaChange(e, setFullDescription)}
        />
      </div>

      <div className="add-image">
      <label htmlFor="image-upload" className="add-image-label">
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="add-image-preview" />
        ) : (
          <span>Select an image</span>
        )}
      </label>
      <input 
        type="file"
        id="image-upload"
        className="add-image-input"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>

      <button disabled={loading || numberOfLetters > 100} type="submit" className="recepie-submit">Submit</button>

      {error ? 
      <h3>{error}</h3>
      : null}
    </form>
  );
}
 
export default AddRecepie;