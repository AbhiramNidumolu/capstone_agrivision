import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Upload.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


function Upload() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const cropVarieties = ["Rice", "Wheat", "Corn", "Tomato"];
  const [image, setImage] = useState(null);
  const [resolutionValid, setResolutionValid] = useState(false);
  // Use dropdown for crop name selection
  const [selectedCrop, setSelectedCrop] = useState(cropVarieties[0]);

  // ✅ Check Image Resolution
  const checkImageResolution = (file) => {
    const img = new window.Image();
    img.onload = function () {
      const width = img.width;
      const height = img.height;

      if (width >= 400 && height >= 400) {
        setResolutionValid(true);
        alert(`✅ Image resolution OK `);
      } else {
        setResolutionValid(false);
        alert(
          `❌ Low image resolution (${width} x ${height}). Please upload an image ≥ 400 x 400.`
        );
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    checkImageResolution(file);
  };

  const handleUpload = async () => {
    if (!token) return navigate("/login");
    if (!resolutionValid)
      return alert("Image does not meet resolution requirement.");

    const formData = new FormData();
    formData.append("name", selectedCrop); // Send dropdown value instead of text input
    formData.append("image", image);

    try {
      await axios.post(
  `${API_BASE_URL}/api/images/upload`,
  formData,
  {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);
      alert("✅ Image uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Upload failed. Check backend console.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Crop Image</h2>

      {/* Crop Variety Dropdown */}
      <label htmlFor="crop-variety" >Crop Variety</label>
      <select
        id="crop-variety"
        className="DropDown"
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
        required
      >
        {cropVarieties.map((variety) => (
          <option key={variety} value={variety}>
            {variety}
          </option>
        ))}
      </select>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button
        onClick={handleUpload}
        disabled={!resolutionValid}
        style={{ marginTop: "10px" }}
      >
        Upload
      </button>
    </div>
  );
}

export default Upload;
