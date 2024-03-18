import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { addDoc, collection, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
  const [resImgLink, setResImgLink] = useState(null);

  const [food, setFood] = useState([0]);
  const [foodForUpload, setFoodForUpload] = useState([{}]);
  const [overallFoodRating, setOverallFoodRating] = useState();

  const [exteriorRating, setExteriorRating] = useState(0);
  const [interiorRating, setInteriorRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [overallLooksRating, setOverallLooksRating] = useState();

  const [hostingRating, setHostingRating] = useState(0);
  const [foodPresentationRating, setFoodPresentationRating] = useState(0);
  const [customerServiceRating, setCustomerServiceRating] = useState(0);
  const [overallServiceRating, setOverallServiceRating] = useState();


  useEffect(() => {
    const overallLooks = Math.round((exteriorRating + interiorRating + locationRating) / 3)
    const overallService = Math.round((hostingRating + foodPresentationRating + customerServiceRating) / 3)
    let overallFood = 0
    let foodRatingCount = 0
    foodForUpload.forEach(food => {
      overallFood += food.taste
      overallFood += food.looks
      overallFood += food.overall
      foodRatingCount += 3;
    })
    const foodRating = Math.round(overallFood / foodRatingCount);
    setOverallLooksRating(overallLooks)
    setOverallServiceRating(overallService)
    setOverallFoodRating(foodRating)
  }, [foodForUpload, exteriorRating, interiorRating, locationRating, hostingRating, foodPresentationRating, customerServiceRating])

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
      const imgLink = await getDownloadURL(ref(storage, `images/${imgName}`))
      setResImgLink(imgLink);
      const newRestaurant = restaurant;
      newRestaurant.image = resImgLink;
      setRestaurant(newRestaurant)
    } catch (err) {
      console.error("Error adding image: ", err);
    }
  };

  const addData = async () => {
    try {
      const collectionRef = collection(db, "restaurants");
      const writtenDoc = await addDoc(collectionRef, restaurant);
      const docRef = doc(db, "restaurants", writtenDoc.id);
      const subDocRef = collection(docRef, "foodratings");
  
      await Promise.all(foodForUpload.map(async(food) => {
        let imgLink;
        try {
          if (food.imageUpload == null) return;
          const imageRef = ref(storage, `images/${food.imgName}`);
          await uploadBytes(imageRef, food.imageUpload);
          imgLink = await getDownloadURL(ref(storage, `images/${food.imgName}`));
        } catch (err) {
          console.error("Error adding image: ", err);
        }
        await addDoc(subDocRef, {
          taste: food.taste,
          looks: food.looks,
          overall: food.overall,
          image: imgLink,
          description: food.description
        });
      }));
  
      console.log("Document written with ID: ", writtenDoc.id);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await uploadFile();
      await addData();
    } catch (err) {
      setError("Failed to add restaurant! Error: ", err);
    }
  };

  useEffect(() => {
    setRestaurant({
      title,
      location,
      fdescription: fullDescription,
      overallFoodRating,
      overallLooksRating,
      overallServiceRating
    });
  }, [title, location, fullDescription, imgName, overallFoodRating, overallLooksRating, overallServiceRating]);

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
      id: v4(),
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

  const handleRateFood = (type, rating, index) => {
    const newFood = [...foodForUpload];
    if (type === "taste") {
      newFood[index].taste = rating;
    } else if (type === "looks") {
      newFood[index].looks = rating;
    } else {
      newFood[index].overall = rating;
    }
    setFoodForUpload(newFood);
  };

  const handleDeleteFood = (index) => {
    const newFood = [...foodForUpload];
    const newFoodCounter = [...food];
    newFood.splice(index, 1);
    newFoodCounter.pop();
    setFood(newFoodCounter);
    setFoodForUpload(newFood);
  };

  useEffect(() => {
    console.log(food);
    console.log(foodForUpload);
  }, [food, foodForUpload]);

  const handleRestaurantRating = (type, rating) => {
    if (type === "exterior") {
      setExteriorRating(rating);
    } else if (type === "interior") {
      setInteriorRating(rating);
    } else if (type === "location") {
      setLocationRating(rating);
    } else if (type === "host") {
      setHostingRating(rating);
    } else if (type === "presentation") {
      setFoodPresentationRating(rating);
    } else if (type === "service") {
      setCustomerServiceRating(rating);
    }
  };

  return !addFood ? (
    <div
      className="
    add-recepies
    animate__animated 
    animate__fadeInDown 
    animate__faster"
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

      <button onClick={() => setAddFood(true)} disabled={loading} className="recepie-submit">
        Next
      </button>

      {error ? <h3>{error}</h3> : null}
    </div>
  ) : (
    <div className="add-food-rating-container">
      <span className="add-food-header">Dodaj jelo:</span>
      {food.map((index) => (
        <div key={index} className="add-food-rating">
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
              value={foodForUpload[index].description}
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
                  fill={foodForUpload[index].taste >= 1 ? "brown" : "none"}
                  size={"40"}
                  id={`taste-${foodForUpload[index].id}-1`}
                  onClick={() => handleRateFood("taste", 1, index)}
                ></Meat>
                <Meat
                  fill={foodForUpload[index].taste >= 2 ? "brown" : "none"}
                  size={"40"}
                  id={`taste-${foodForUpload[index].id}-2`}
                  onClick={() => handleRateFood("taste", 2, index)}
                ></Meat>
                <Meat
                  fill={foodForUpload[index].taste >= 3 ? "brown" : "none"}
                  size={"40"}
                  id={`taste-${foodForUpload[index].id}-3`}
                  onClick={() => handleRateFood("taste", 3, index)}
                ></Meat>
                <Meat
                  fill={foodForUpload[index].taste >= 4 ? "brown" : "none"}
                  size={"40"}
                  id={`taste-${foodForUpload[index].id}-4`}
                  onClick={() => handleRateFood("taste", 4, index)}
                ></Meat>
                <Meat
                  fill={foodForUpload[index].taste >= 5 ? "brown" : "none"}
                  size={"40"}
                  id={`taste-${foodForUpload[index].id}-5`}
                  onClick={() => handleRateFood("taste", 5, index)}
                ></Meat>
              </div>
            </div>
            <div className="food-rating-section">
              <span>Izgled</span>
              <div>
                <Star
                  fill={foodForUpload[index].looks >= 1 ? "gold" : "none"}
                  size={"40"}
                  id={`looks-${foodForUpload[index].id}-1`}
                  onClick={() => handleRateFood("looks", 1, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].looks >= 2 ? "gold" : "none"}
                  size={"40"}
                  id={`looks-${foodForUpload[index].id}-2`}
                  onClick={() => handleRateFood("looks", 2, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].looks >= 3 ? "gold" : "none"}
                  size={"40"}
                  id={`looks-${foodForUpload[index].id}-3`}
                  onClick={() => handleRateFood("looks", 3, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].looks >= 4 ? "gold" : "none"}
                  size={"40"}
                  id={`looks-${foodForUpload[index].id}-4`}
                  onClick={() => handleRateFood("looks", 4, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].looks >= 5 ? "gold" : "none"}
                  size={"40"}
                  id={`looks-${foodForUpload[index].id}-5`}
                  onClick={() => handleRateFood("looks", 5, index)}
                ></Star>
              </div>
            </div>
            <div className="food-rating-section">
              <span>Ukupan dojam</span>
              <div>
                <Star
                  fill={foodForUpload[index].overall >= 1 ? "gold" : "none"}
                  size={"40"}
                  id={`overall-${foodForUpload[index].id}-1`}
                  onClick={() => handleRateFood("overall", 1, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].overall >= 2 ? "gold" : "none"}
                  size={"40"}
                  id={`overall-${foodForUpload[index].id}-2`}
                  onClick={() => handleRateFood("overall", 2, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].overall >= 3 ? "gold" : "none"}
                  size={"40"}
                  id={`overall-${foodForUpload[index].id}-3`}
                  onClick={() => handleRateFood("overall", 3, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].overall >= 4 ? "gold" : "none"}
                  size={"40"}
                  id={`overall-${foodForUpload[index].id}-4`}
                  onClick={() => handleRateFood("overall", 4, index)}
                ></Star>
                <Star
                  fill={foodForUpload[index].overall >= 5 ? "gold" : "none"}
                  size={"40"}
                  id={`overall-${foodForUpload[index].id}-5`}
                  onClick={() => handleRateFood("overall", 5, index)}
                ></Star>
              </div>
            </div>
          </div>
          {index > 0 && (
            <button
              onClick={() => handleDeleteFood(index)}
              class="deleteButton"
            >
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
          )}
        </div>
      ))}
      <div className="add-more-food">
        <button onClick={handleAddMoreFood} type="button" class="button">
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
      <span className="add-food-header">Ocijeni restoran:</span>
      <div className="restaurant-rating-container">
        <div className="restaurant-looks">
          <span>Eksterijer</span>
          <div>
            <Star
              fill={exteriorRating >= 1 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("exterior", 1)}
            ></Star>
            <Star
              fill={exteriorRating >= 2 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("exterior", 2)}
            ></Star>
            <Star
              fill={exteriorRating >= 3 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("exterior", 3)}
            ></Star>
            <Star
              fill={exteriorRating >= 4 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("exterior", 4)}
            ></Star>
            <Star
              fill={exteriorRating >= 5 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("exterior", 5)}
            ></Star>
          </div>
          <span>Enterijer</span>
          <div>
            <Star
              fill={interiorRating >= 1 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("interior", 1)}
            ></Star>
            <Star
              fill={interiorRating >= 2 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("interior", 2)}
            ></Star>
            <Star
              fill={interiorRating >= 3 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("interior", 3)}
            ></Star>
            <Star
              fill={interiorRating >= 4 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("interior", 4)}
            ></Star>
            <Star
              fill={interiorRating >= 5 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("interior", 5)}
            ></Star>
          </div>
          <span>Lokacija</span>
          <div>
            <Star
              fill={locationRating >= 1 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("location", 1)}
            ></Star>
            <Star
              fill={locationRating >= 2 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("location", 2)}
            ></Star>
            <Star
              fill={locationRating >= 3 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("location", 3)}
            ></Star>
            <Star
              fill={locationRating >= 4 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("location", 4)}
            ></Star>
            <Star
              fill={locationRating >= 5 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("location", 5)}
            ></Star>
          </div>
        </div>
        <div className="restaurant-service">
          <span>Docek gosta</span>
          <div>
            <Star
              fill={hostingRating >= 1 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("host", 1)}
            ></Star>
            <Star
              fill={hostingRating >= 2 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("host", 2)}
            ></Star>
            <Star
              fill={hostingRating >= 3 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("host", 3)}
            ></Star>
            <Star
              fill={hostingRating >= 4 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("host", 4)}
            ></Star>
            <Star
              fill={hostingRating >= 5 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("host", 5)}
            ></Star>
          </div>
          <span>Prezentacija hrane</span>
          <div>
            <Star
              fill={foodPresentationRating >= 1 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("presentation", 1)}
            ></Star>
            <Star
              fill={foodPresentationRating >= 2 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("presentation", 2)}
            ></Star>
            <Star
              fill={foodPresentationRating >= 3 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("presentation", 3)}
            ></Star>
            <Star
              fill={foodPresentationRating >= 4 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("presentation", 4)}
            ></Star>
            <Star
              fill={foodPresentationRating >= 5 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("presentation", 5)}
            ></Star>
          </div>
          <span>Odnos prema gostima</span>
          <div>
            <Star
              fill={customerServiceRating >= 1 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("service", 1)}
            ></Star>
            <Star
              fill={customerServiceRating >= 2 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("service", 2)}
            ></Star>
            <Star
              fill={customerServiceRating >= 3 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("service", 3)}
            ></Star>
            <Star
              fill={customerServiceRating >= 4 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("service", 4)}
            ></Star>
            <Star
              fill={customerServiceRating >= 5 ? "gold" : "none"}
              size={"40"}
              onClick={() => handleRestaurantRating("service", 5)}
            ></Star>
          </div>
        </div>
      </div>
      <span className="add-food-header">Pregled prosjeka ocjena:</span>
      <div className="restaurant-rating-container">
      <div className="restaurant-looks">
          <span>Hrana</span>
          <div>
            <Star
              fill={overallFoodRating >= 1 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallFoodRating >= 2 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallFoodRating >= 3 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallFoodRating >= 4 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallFoodRating >= 5 ? "gold" : "none"}
              size={"40"}
            ></Star>
          </div>
          <span>Izgled restorana</span>
          <div>
            <Star
              fill={overallLooksRating >= 1 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallLooksRating >= 2 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallLooksRating >= 3 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallLooksRating >= 4 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallLooksRating >= 5 ? "gold" : "none"}
              size={"40"}
            ></Star>
          </div>
          <span>Usluga</span>
          <div>
            <Star
              fill={overallServiceRating >= 1 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallServiceRating >= 2 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallServiceRating >= 3 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallServiceRating >= 4 ? "gold" : "none"}
              size={"40"}
            ></Star>
            <Star
              fill={overallServiceRating >= 5 ? "gold" : "none"}
              size={"40"}
            ></Star>
          </div>
        </div>
        </div>
      <button onClick={handleSubmit} disabled={loading} className="recepie-submit finish">
        Finish
      </button>
    </div>
  );
};

export default AddRestaurant;
