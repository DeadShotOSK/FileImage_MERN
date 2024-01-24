import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import PageNotFound from "../PageNotFound";

import "bootstrap/dist/css/bootstrap.min.css";
import "./FileForm.css";

const FileForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [fileData, setFileData] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState("true");

    const token = Cookies.get("token");
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (token === null || token === undefined) {
            setIsLoggedIn("false");
        }
    }, [token]);

    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getFile = (e) => {
        setFileData(e.target.files[0]);
    };

    const handleUploadForm = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("file", fileData);

        if (!formData.title || !formData.description || !fileData) {
            alert("Please fill all the fields!");
        } else {
            axios
                .post(`http://localhost:7000/fi/createFile/${userid}`, data)
                .then((res) => {
                    if (res.data.status === "Success") {
                        alert(res.data.message);
                        navigate(`/getFiles/${userid}`);
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
                <form className="formFile" onSubmit={handleUploadForm}>
                    <h2>Upload File</h2>
                    <div className="fileElement">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            placeholder="Enter file title"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="fileElement">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            placeholder="Enter file description"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="fileElement">
                        <label>Select File</label>
                        <input type="file" name="file" onChange={getFile} required />
                    </div>
                    <button className="btn btn-success">Upload</button>
                </form>
            )}
            {isLoggedIn === "false" && <PageNotFound />}
        </>
    );
};

export default FileForm;