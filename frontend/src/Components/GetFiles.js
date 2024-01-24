import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { MDBInputGroup, MDBInput } from "mdb-react-ui-kit";
import { FaRegComment } from 'react-icons/fa6';

import { useDispatch, useSelector } from "react-redux";
import { addfiles, getAllFiles } from "../Redux/FileReducers";

import PageNotFound from "./PageNotFound";
import LikeFileButton from "./LikeDislikeButtons/LikeFileButton";
import DislikeFileButton from "./LikeDislikeButtons/DislikeFileButton";

import "bootstrap/dist/css/bootstrap.min.css";
import "./UserForm.css";

const GetFiles = ({ socket }) => {
  // const [getData, setGetData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState("true");
  const [search, setSearch] = useState("");

  const token = Cookies.get("token");
  const { userid } = useParams();
  const dispatch = useDispatch();
  const getData = useSelector(getAllFiles)

  useEffect(() => {
    if (token === null || token === undefined) {
      setIsLoggedIn("false");
    }
  }, [token]);

  useEffect(() => {
    socket.on("updated-likeAndDislikeFile", (update) => {
      dispatch(addfiles(update));
      // console.log(update);
    });
  }, []);

  const onClickHandler = (e) => {
    e.preventDefault();
    let parameter = e.target.innerText;
    axios
      .get(`http://localhost:7000/fi/getUploadedFile/${parameter}`, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        // console.log(url);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${parameter}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, Please sign in");
      });
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <>
      {isLoggedIn === "true" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4 className="heading">List of all uploaded files</h4>
            <div>
              Total Files: {getData.length}
            </div>
            <br />
            <MDBInputGroup style={{ marginLeft: "5rem" }}>
              <MDBInput placeholder="Search Here" onChange={searchHandler} />
            </MDBInputGroup>
          </div>
          <br />
          <div>CLick to download a file</div>
          <br />
          <div>
            {getData
              .filter(
                (searchTerm) =>
                  searchTerm.title
                    .toLowerCase()
                    .includes(search?.toLocaleLowerCase()) ||
                  searchTerm.creator.username
                    .toLowerCase()
                    .includes(search?.toLocaleLowerCase())
              )
              .map((data, index) => {
                return (
                  <Card
                    style={{ width: "25rem", margin: "10px" }}
                    key={index}
                  >
                    <Card.Title
                      style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
                    >
                      {data.creator.username} :
                    </Card.Title>
                    <Card.Body>
                      <Card.Title>{data.title}</Card.Title>
                      <Card.Text>{data.description}</Card.Text>
                      <Button variant="warning" onClick={onClickHandler}>
                        {data.file.split("\\")[1]}
                      </Button>
                      <br />
                      <br />
                      {data.like.includes(userid) && (
                        <LikeFileButton
                          fileId={data._id}
                          userId={userid}
                          colour={"red"}
                          socket={socket}
                        />
                      )}
                      {!data.like.includes(userid) && (
                        <LikeFileButton
                          fileId={data._id}
                          userId={userid}
                          colour={"black"}
                          socket={socket}
                        />
                      )}
                      {data.like.includes(userid) && (
                        <DislikeFileButton
                          fileId={data._id}
                          userId={userid}
                          colour={"black"}
                          socket={socket}
                        />
                      )}
                      <FaRegComment size={24} style={{ marginLeft: "4px", cursor: "pointer" }} />
                      {data.like.length >= 2 ? (
                        <Card.Text>{data.like.length} likes</Card.Text>
                      ) : (
                        <Card.Text>{data.like.length} like</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
      {isLoggedIn === "false" && <PageNotFound />}
    </>
  );
};

export default GetFiles;