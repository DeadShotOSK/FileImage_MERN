import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import PageNotFound from "../PageNotFound";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ImageUpload.css";

const ImageForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    radio: "Image"
  });
  const [imageurl, setImageUrl] = useState("");

  // for preview image
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const [isLoggedIn, setIsLoggedIn] = useState("true");

  const token = Cookies.get("token");
  const { userid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null || token === undefined) {
      setIsLoggedIn("false");
    }
  }, [token]);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFile(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getImage = (e) => {
    setImageUrl(e.target.files[0]);

    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    }

    setSelectedFile(e.target.files[0]);
  };

  const handleUploadImage = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("caption", formData.caption);
    data.append("file", imageurl);
    data.append("radio", formData.radio);
    if (!formData.title || !formData.caption || !imageurl || !formData.radio) {
      alert("Please fill all the fields!");
    } else {
      axios
      .post(`http://localhost:7000/fi/createImage/${userid}`, data)
      .then((res) => {
        if (res.data.status === "Success") {
          alert(res.data.message);
          navigate(`/image/${userid}`);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  return (
    <>
      {isLoggedIn === "true" && (
        <form className="formImage" onSubmit={handleUploadImage}>
          <h2>Upload Image/File</h2>
          <div className="imageElement">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Enter title"
              onChange={handleChange}
            />
          </div>
          <div className="imageElement">
            <label htmlFor="caption">Caption</label>
            <input
              type="text"
              name="caption"
              value={formData.caption}
              placeholder="Enter caption"
              onChange={handleChange}
            />
          </div>
          <div className="imageElement">
            <label htmlFor="image/file">Select Image</label>
            <input type="file" name="file" onChange={getImage} required />
            <br />
            {selectedFile && <img src={preview} height={200} width={300} alt="#"/>}
          </div>
          <div>
            <label htmlFor="image" className="radio_image">Image</label>
            <input type="radio" name="radio" value="Image" onChange={handleChange} checked={formData.radio === "Image"}/>
            <label htmlFor="file" className="radio_file">File</label>
            <input type="radio" name="radio" value="File" onChange={handleChange} checked={formData.radio === "File"}/>
          </div>
          <button className="btn btn-success">Upload</button>
        </form>
      )}
      {isLoggedIn === "false" && <PageNotFound />}
    </>
  );
};

export default ImageForm;