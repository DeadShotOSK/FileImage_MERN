import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import PageNotFound from "../PageNotFound";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ImageUpload.css";

const ImageForm = ({ isLoggedIn, updateData }) => {
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    radio: "Image"
  });
  const [imageurl, setImageUrl] = useState("");

  const [formErrors, setFormErrors] = useState({
    titleError: "",
    captionError: ""
  });

  const [mandatory, setMandatory] = useState(false);
  const [valid, setValid] = useState(false);

  const [message] = useState({
    "TITLE_ERROR": "Title should be at least 3 letter",
    "CAPTION_ERROR": "Enter a caption",
    "MANDATORY": "Please fill all the fields"
  });

  // for preview image
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const { userid } = useParams();
  const navigate = useNavigate();


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
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (value.length < 3) {
          setFormErrors({ titleError: message.TITLE_ERROR });
          setValid(true);
        } else {
          setFormErrors({ titleError: "" });
          setValid(false);
        }
        break;

      case "caption":
        if (value.length < 3) {
          setFormErrors({ captionError: message.CAPTION_ERROR });
          setValid(true);
        } else {
          setFormErrors({ captionError: "" });
          setValid(false);
        }
        break;

      default:
        setFormErrors({
          titleError: "",
          captionError: ""
        });
        break;
    }
  }

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
      setMandatory("Please fill all the fields!");
    } else {
      axios
        .post(`http://localhost:7000/fi/createImage/${userid}`, data)
        .then((res) => {
          if (res.data.status === "Success") {
            alert(res.data.message);
            navigate(`/image/${userid}`);
            updateData(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {isLoggedIn ? (
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
            <div>{formErrors.titleError && <span className="text-danger">{formErrors.titleError}</span>}</div>
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
            <div>{formErrors.captionError && <span className="text-danger">{formErrors.captionError}</span>}</div>
          </div>
          <div className="imageElement">
            <label htmlFor="image/file">Select Image</label>
            <input type="file" name="file" onChange={getImage} required />
            <br />
            {selectedFile && <img src={preview} height={200} width={300} alt="#" />}
          </div>
          <div>
            <label htmlFor="image" className="radio_image">Image</label>
            <input type="radio" name="radio" value="Image" onChange={handleChange} checked={formData.radio === "Image"} />
            <label htmlFor="file" className="radio_file">File</label>
            <input type="radio" name="radio" value="File" onChange={handleChange} checked={formData.radio === "File"} />
          </div>
          <div>{mandatory && <span className="text-danger">{mandatory}</span>}</div>
          {valid ? <button disabled className="btn btn-success">Upload</button> : <button className="btn btn-success">Upload</button>}
        </form>
      ) : <PageNotFound />}
    </>
  );
};

export default ImageForm;