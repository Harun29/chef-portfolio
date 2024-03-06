import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import { v4 } from "uuid";

const AddRestaurant = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addFood, setAddFood] = useState("");

  const [restaurant, setRestaurant] = useState();

  const [imageUpload, setImageUpload] = useState(null);
  const [imgName, setImgName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [food, setFood] = useState([0]);
  const [foodForUpload, setFoodForUpload] = useState([{}]);

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
    } catch (err) {
      console.error("Error adding image: ", err);
    }
  };

  const addData = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "restaurants"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      // await uploadFile();
      // await addData(restaurant);
      setAddFood(true);
    } catch (err) {
      setError("Failed to add restaurant! Error: ", err);
    }
  };

  useEffect(() => {
    setRestaurant({
      title,
      location,
      fdescription: fullDescription,
      imgName,
    });
  }, [title, location, fullDescription, imgName]);

  /* FUNCTION FOR EXPANDING TEXT AREA */
  const handleTextareaChange = (e, setFunction) => {
    setFunction(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `calc(${e.target.scrollHeight}px - 25px)`;
  };

  const handleAddMoreFood = () => {
    const object = {
      description: "",
      selectedImage: "",
    };
    setFood((prevFoodCounter) => [...prevFoodCounter, prevFoodCounter.length]);
    setFoodForUpload((prevFoodCounter) => [...prevFoodCounter, object]);
  };

  const handleFoodDescriptionChange = (description, index) => {
    console.log(index);
    const newFood = [...foodForUpload];
    newFood[index].description = description;
    setFoodForUpload(newFood);
  };

  const handleFoodImageChange = (file, index) => {
    console.log(index);
    if (file) {
      const newFood = [...foodForUpload];
      newFood[index].imageUpload = file;
      newFood[index].imgName = file.name + v4();
      newFood[index].selectedImage = URL.createObjectURL(file);
      setFoodForUpload(newFood);
    }
  };

  useEffect(() => {
    console.log(foodForUpload);
  }, [foodForUpload]);

  useEffect(() => {
    console.log(imageUpload);
  }, [imageUpload]);

  return !addFood ? (
    <form
      className="
    add-recepies
    animate__animated 
    animate__fadeInDown 
    animate__faster"
      onSubmit={handleSubmit}
    >
      <h2>Dodaj restoran</h2>
      <div className="add-title">
        <textarea
          type="text"
          required
          value={title}
          placeholder="Ime restorana"
          onChange={(e) => handleTextareaChange(e, setTitle)}
        />
      </div>
      <div className="short-description">
        <textarea
          type="text"
          required
          value={location}
          placeholder="location link"
          onChange={(e) => handleTextareaChange(e, setLocation)}
        />
      </div>
      <div className="full-description">
        <textarea
          type="text"
          required
          value={fullDescription}
          placeholder="description"
          onChange={(e) => handleTextareaChange(e, setFullDescription)}
        />
      </div>

      <div className="add-image">
        <label htmlFor="image-upload" className="add-image-label">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="add-image-preview"
            />
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

      <button disabled={loading} type="submit" className="recepie-submit">
        Next
      </button>

      {error ? <h3>{error}</h3> : null}
    </form>
  ) : (
    <div className="add-food-rating-container">
      {food.map((index) => (
        <form key={index} className="add-food-rating">
          <div key={index} className="add-image">
            <label htmlFor={`image-upload-${index}`} className="add-image-label">
              {foodForUpload[index].selectedImage ? (
                <img
                  src={foodForUpload[index].selectedImage}
                  alt="Selected"
                  className="add-image-preview"
                />
              ) : (
                <span>Select an image</span>
              )}
            </label>
            <input
              type="file"
              id={`image-upload-${index}`}
              className="add-image-input"
              accept="image/*"
              onChange={(e) => handleFoodImageChange(e.target.files[0], index)}
            />
          </div>
          <div className="full-description">
            <textarea
              type="text"
              required
              placeholder="description"
              onChange={(e) =>
                handleFoodDescriptionChange(e.target.value, index)
              }
            />
          </div>
        </form>
      ))}
      <div onClick={handleAddMoreFood} className="add-more-food">
        plus
      </div>
    </div>
  );
};

export default AddRestaurant;
