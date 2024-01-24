import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { MDBInputGroup, MDBInput } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { addImages, getAllImages } from "../Redux/ImageReducers";
import { FaRegComment } from "react-icons/fa6";
import { addfiles, getAllFiles } from "../Redux/FileReducers";

import PageNotFound from "./PageNotFound";
import LikeImageButton from "./LikeDislikeButtons/LikeImageButton";
import DislikeImageButton from "./LikeDislikeButtons/DislikeImageButton";
import LikeFileButton from "./LikeDislikeButtons/LikeFileButton";
import DislikeFileButton from "./LikeDislikeButtons/DislikeFileButton";
import ImageComment from "./PopUp/ImageComment";
import FileComment from "./PopUp/FileComment";

import "bootstrap/dist/css/bootstrap.min.css";
import "./UserForm.css";

const ShowImage = ({ socket }) => {
  const [isLoggedIn, setIsLoggedIn] = useState("true");
  const [search, setSearch] = useState("");
  const [imageCommentBox, setimageCommentBox] = useState(false);
  const [fileCommentBox, setFileCommentBox] = useState(false);

  const [fileCommentValues, setFileCommentValues] = useState({
    fileId: "",
    fileComments: [],
  });
  const [imageCommentValues, setImageCommentValues] = useState({
    imageId: "",
    imageComments: [],
  });

  const imageCommentClickHandler = (e, id, comments) => {
    !imageCommentBox ? setimageCommentBox(true) : setimageCommentBox(false);
    setImageCommentValues({
      imageId: id,
      imageComments: comments,
    });
  };

  const fileCommentClickHandler = (e, id, comments) => {
    !fileCommentBox ? setFileCommentBox(true) : setFileCommentBox(false);
    setFileCommentValues({
      fileId: id,
      fileComments: comments,
    });
  };

  const token = Cookies.get("token");
  const { userid } = useParams();
  const dispatch = useDispatch();
  const image = useSelector(getAllImages);
  const getData = useSelector(getAllFiles);

  // Socket Connections
  useEffect(() => {
    // Image Like/Dislike
    socket.on("updated-likeAndDislike", (update) => {
      dispatch(addImages(update));
    });
    // File Like/Dislike
    socket.on("updated-likeAndDislikeFile", (update) => {
      dispatch(addfiles(update));
    });
    // Image Comment
    socket.on("update-ImageComment", (update) => {
      dispatch(addImages(update));
    })
    // File Comment
    socket.on("update-FileComment", (update) => {
      dispatch(addfiles(update));
    })
  }, [dispatch, socket]);

  // for file download
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

  useEffect(() => {
    if (token === null || token === undefined) {
      setIsLoggedIn("false");
    }
  }, [token]);

  const searchHandler = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };
  return (
    <>
      {isLoggedIn === "true" && (
        <>
          <div className="flex_column" style={{ alignItems: "center" }}>
            <div className="flex_column" style={{ alignItems: "center" }} >
              <h4 className="heading">List of all uploaded Images/Files</h4>
              <div>Total Images: {image.length}</div>
              <div>Total Files: {getData.length}</div>
              <div>CLick to download a file</div>
              <br />
              <MDBInputGroup style={{ marginLeft: "5rem" }}>
                <MDBInput placeholder="Search Here" onChange={searchHandler} />
              </MDBInputGroup>
            </div>
          </div>
          <br />
          <div className="flex_row">
            <div className="flex_column" style={{ alignItems: "center", margin: "auto" }}>
              <div>
                {image
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
                      <Card className="card" key={index}>
                        <Card.Title style={{ padding: "5px", marginLeft: "7px" }} >
                          {data.creator.username} :
                        </Card.Title>
                        <Card.Img
                          variant="top"
                          src={`http://localhost:7000/fi/showImage/${
                            data.image.split("\\")[1]
                          }`}
                        />
                        <Card.Body>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>{data.caption}</Card.Text>
                          {data.like.includes(userid) && (
                            <LikeImageButton
                              imageId={data._id}
                              userId={userid}
                              colour={"red"}
                              socket={socket}
                            />
                          )}
                          {!data.like.includes(userid) && (
                            <LikeImageButton
                              imageId={data._id}
                              userId={userid}
                              colour={"black"}
                              socket={socket}
                            />
                          )}
                          {data.like.includes(userid) && (
                            <DislikeImageButton
                              imageId={data._id}
                              userId={userid}
                              colour={"black"}
                              socket={socket}
                            />
                          )}
                          <FaRegComment
                            onClick={(e) => imageCommentClickHandler(e, data._id, data.comments)}
                            size={24}
                            className="comment_button"
                          />
                          <div className="flex_row" style={{ marginBottom: "5px" }}>
                            <div>
                              {data.like.length >= 2 ? (
                                <Card.Text>{data.like.length} likes</Card.Text>
                              ) : (
                                <Card.Text>{data.like.length} like</Card.Text>
                              )}
                            </div>
                            <div style={{marginLeft: "10px"}}>
                              {data.comments.length >= 2 ? (
                                <Card.Text>
                                  {data.comments.length} comments
                                </Card.Text>
                              ) : (
                                <Card.Text>
                                  {data.comments.length} comment
                                </Card.Text>
                              )}
                            </div>
                          </div>
                          {imageCommentBox &&
                            data._id === imageCommentValues.imageId && (
                              <ImageComment
                                userId={userid}
                                imageId={imageCommentValues.imageId}
                                comments={imageCommentValues.imageComments}
                                socket={socket}
                              />
                            )}
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </div>
            <div className="flex_column"
              style={{ alignItems: "center", margin: "auto" }}>
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
                      <Card className="card" key={index}>
                        <Card.Title
                          className="card_title"
                        >
                          {data.creator.username} :
                        </Card.Title>
                        <Card.Body>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>{data.caption}</Card.Text>
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
                          <FaRegComment
                            onClick={(e) => fileCommentClickHandler(e, data._id, data.comments)}
                            size={24}
                            className="comment_button"
                          />
                          <div className="flex_row" style={{ marginBottom: "5px" }}>
                            <div>
                              {data.like.length >= 2 ? (
                                <Card.Text>{data.like.length} likes</Card.Text>
                              ) : (
                                <Card.Text>{data.like.length} like</Card.Text>
                              )}
                            </div>
                            <div style={{marginLeft: "10px"}}>
                              {data.comments.length >= 2 ? (
                                <Card.Text>
                                  {data.comments.length} comments
                                </Card.Text>
                              ) : (
                                <Card.Text>
                                  {data.comments.length} comment
                                </Card.Text>
                              )}
                            </div>
                          </div>
                          {fileCommentBox &&
                            data._id === fileCommentValues.fileId && (
                              <FileComment
                                userId={userid}
                                fileId={fileCommentValues.fileId}
                                comments={fileCommentValues.fileComments}
                                socket={socket}
                              />
                            )}
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
      {isLoggedIn === "false" && <PageNotFound />}
    </>
  );
};

export default ShowImage;