import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import { v4 } from "uuid";
import Meat from "../icons/Meat";
import Star from "../icons/Star";

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

  const handleRateFood = (type, rating, index) => {
    const newFood = [...foodForUpload];
    let color = "gold";
    if (type === "taste") {
      newFood[index].taste = rating;
      color = "brown";
    } else if (type === "looks") {
      newFood[index].looks = rating;
    } else {
      newFood[index].overall = rating;
    }
    for (let a = 1; a <= 5; a++) {
      if (a <= rating) {
        document
          .getElementById(`${type}-${index}-${a}`)
          .setAttribute("fill", color);
      } else {
        document
          .getElementById(`${type}-${index}-${a}`)
          .setAttribute("fill", "none");
      }
    }
    setFoodForUpload(newFood);
  };

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
            <label
              htmlFor={`image-upload-${index}`}
              className="add-image-label"
            >
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
          <div className="food-description">
            <textarea
              type="text"
              required
              placeholder="description"
              onChange={(e) =>
                handleFoodDescriptionChange(e.target.value, index)
              }
            />
          </div>
          <div className="food-rating">
            <div className="food-rating-section">
              <span>Ukus</span>
              <div>
                <Meat
                  size={"40"}
                  id={`taste-${index}-1`}
                  onClick={() => handleRateFood("taste", 1, index)}
                ></Meat>
                <Meat
                  size={"40"}
                  id={`taste-${index}-2`}
                  onClick={() => handleRateFood("taste", 2, index)}
                ></Meat>
                <Meat
                  size={"40"}
                  id={`taste-${index}-3`}
                  onClick={() => handleRateFood("taste", 3, index)}
                ></Meat>
                <Meat
                  size={"40"}
                  id={`taste-${index}-4`}
                  onClick={() => handleRateFood("taste", 4, index)}
                ></Meat>
                <Meat
                  size={"40"}
                  id={`taste-${index}-5`}
                  onClick={() => handleRateFood("taste", 5, index)}
                ></Meat>
              </div>
            </div>
            <div className="food-rating-section">
              <span>Izgled</span>
              <div>
                <Star
                  size={"40"}
                  id={`looks-${index}-1`}
                  onClick={() => handleRateFood("looks", 1, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`looks-${index}-2`}
                  onClick={() => handleRateFood("looks", 2, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`looks-${index}-3`}
                  onClick={() => handleRateFood("looks", 3, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`looks-${index}-4`}
                  onClick={() => handleRateFood("looks", 4, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`looks-${index}-5`}
                  onClick={() => handleRateFood("looks", 5, index)}
                ></Star>
              </div>
            </div>
            <div className="food-rating-section">
              <span>Ukupan dojam</span>
              <div>
                <Star
                  size={"40"}
                  id={`overall-${index}-1`}
                  onClick={() => handleRateFood("overall", 1, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`overall-${index}-2`}
                  onClick={() => handleRateFood("overall", 2, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`overall-${index}-3`}
                  onClick={() => handleRateFood("overall", 3, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`overall-${index}-4`}
                  onClick={() => handleRateFood("overall", 4, index)}
                ></Star>
                <Star
                  size={"40"}
                  id={`overall-${index}-5`}
                  onClick={() => handleRateFood("overall", 5, index)}
                ></Star>
              </div>
            </div>
          </div>
          <button class="deleteButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 50 59"
              class="bin"
            >
              <path
                fill="#B5BAC1"
                d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z"
              ></path>
              <path
                fill="#B5BAC1"
                d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z"
              ></path>
              <path
                fill="#B5BAC1"
                d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
              <path
                fill="#B5BAC1"
                d="M2 13H48L47.6742 21.28H2.32031L2 13Z"
              ></path>
            </svg>

            <span class="tooltip">Delete</span>
          </button>
        </form>
      ))}
      <div onClick={handleAddMoreFood} className="add-more-food">
        <button type="button" class="button">
          <span class="button__text">Add Item</span>
          <span class="button__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke="currentColor"
              height="24"
              fill="none"
              class="svg"
            >
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddRestaurant;
