import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllFiles, addfiles } from "../Redux/FileReducers";
import { getAllImages, addImages } from "../Redux/ImageReducers";
import { FaRegComment } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";
import { GlobalData } from "../App";

import LikeImageButton from "./LikeDislikeButtons/LikeImageButton";
import DislikeImageButton from "./LikeDislikeButtons/DislikeImageButton";
import LikeFileButton from "./LikeDislikeButtons/LikeFileButton";
import DislikeFileButton from "./LikeDislikeButtons/DislikeFileButton";
import DeleteDialogBox from "./PopUp/DeleteDialogBox";
import UpdateImage from "./PopUp/UpdateImage";
import UpdateFile from "./PopUp/UpdateFile";
import ImageComment from "./PopUp/ImageComment";
import FileComment from "./PopUp/FileComment";
import UpdateUserDetails from "./PopUp/UpdateUserDetails";
import PageNotFound from "./PageNotFound";

import "./MyProfile.css";

const MyProfile = ({ socket, updateData }) => {
  const { isLoggedIn } = useContext(GlobalData);
  const [myProfile, setMyProfile] = useState({});
  const [updateuserBox, setUpdateUserBox] = useState(false);
  const userUpdateHandler = () => {
    setUpdateUserBox(!updateuserBox);
  }

  // Update Image and File
  const [updateImageData, setUpdateImageData] = useState({
    title: '',
    updateImageId: ''
  });
  const [updateFileData, setUpdateFileData] = useState({
    title: '',
    updateFileId: ''
  });

  const [updateImageBox, setUpdateImageBox] = useState(false);
  const handleImageUpdate = (e, id, title) => {
    if (!updateImageBox) {
      setUpdateImageBox(true);
      setUpdateImageData({
        title: title,
        updateImageId: id
      });
    } else {
      setUpdateImageBox(false);
    }
  };

  const [updateFileBox, setUpdateFileBox] = useState(false);
  const handleFileUpdate = (e, id, title) => {
    if (!updateFileBox) {
      setUpdateFileBox(true);
      setUpdateFileData({
        title: title,
        updateFileId: id
      })
    } else {
      setUpdateFileBox(false);
    }
  };

  // Comment Image and File
  const [imageCommentBox, setimageCommentBox] = useState(false);
  const [fileCommentBox, setFileCommentBox] = useState(false);

  const [fileCommentValues, setFileCommentValues] = useState({
    fileId: '',
    fileComments: []
  });
  const [imageCommentValues, setImageCommentValues] = useState({
    imageId: '',
    imageComments: []
  });

  const fileCommentClickHandler = (e, id, comments) => {
    !fileCommentBox ? setFileCommentBox(true) : setFileCommentBox(false);
    setFileCommentValues({
      fileId: id,
      fileComments: comments
    })
  }
  const imageCommentClickHandler = (e, id, comments) => {
    !imageCommentBox ? setimageCommentBox(true) : setimageCommentBox(false);
    setImageCommentValues({
      imageId: id,
      imageComments: comments
    });
  };

  const { userid } = useParams();

  const isTableOrMobile = useMediaQuery({ query: "(max-width: 992px)" });

  const token = Cookie.get("token");
  const dispatch = useDispatch();

  const [updateCurrentUser, setUpdateCurrentUser] = useState(false);
  const updateCurrentUserDetails = (data) => {
    setUpdateCurrentUser(data);
  }

  useEffect(() => {
    // console.log(myProfile);
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(`http://localhost:7000/users/userProfile/${userid}`, { headers })
      .then((res) => {
        setMyProfile(res.data.userData);
      })
      .catch((err) => {
        console.log(err);
      });
    updateCurrentUserDetails(false);
  }, [token, userid, updateCurrentUser]);

  // myProfile.userdetails = useSelector(getAllUsers).filter(data => data._id.includes(userid))[0];
  const images = useSelector(getAllImages).filter((data) =>
    data.creator._id.includes(userid)
  );
  const files = useSelector(getAllFiles).filter((data) =>
    data.creator._id.includes(userid)
  );
  // console.log(myProfile);

  const handleUpdateLikeDislikeImage = useCallback((update) => {
    dispatch(addImages(update));
  }, [dispatch]);

  const handleUpdateLikeDislikeFile = useCallback((update) => {
    dispatch(addfiles(update));
  }, [dispatch]);

  const handleUpdateImageComment = useCallback((update) => {
    dispatch(addImages(update));
  }, [dispatch]);

  const handleUpdateFileComment = useCallback((update) => {
    dispatch(addfiles(update));
  }, [dispatch]);

  useEffect(() => {
    // Image Like/Dislike
    socket.on("updated-likeAndDislike", handleUpdateLikeDislikeImage);
    // File Like/Dislike
    socket.on("updated-likeAndDislikeFile", handleUpdateLikeDislikeFile);
    // Image Comment
    socket.on("update-ImageComment", handleUpdateImageComment);
    // File Comment
    socket.on("update-FileComment", handleUpdateFileComment);

    return () => {
      socket.off("updated-likeAndDislike", handleUpdateLikeDislikeImage);
      socket.off("updated-likeAndDislikeFile", handleUpdateLikeDislikeFile);
      socket.off("update-ImageComment", handleUpdateImageComment);
      socket.off("update-FileComment", handleUpdateFileComment);
    }
  }, [socket, handleUpdateLikeDislikeImage, handleUpdateLikeDislikeFile, handleUpdateImageComment, handleUpdateFileComment]);

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

  // Delete Image with dialog box confirmation

  const [imageDialog, setImageDialog] = useState({
    message: "",
    isLoding: false,
  });

  const imageIdRef = useRef();

  const handleImageDialog = (message, isLoding) => {
    setImageDialog({
      message,
      isLoding,
    });
  };

  const handleDeleteImage = (e, id, title) => {
    e.preventDefault();
    handleImageDialog(
      `Are you sure you want to delete "${title}" image?`,
      true
    );
    imageIdRef.current = id;
  };

  const areYouSureDeleteImage = (choose) => {
    if (choose) {
      axios
        .delete(
          `http://localhost:7000/fi/deleteImage/${imageIdRef.current}/${userid}`
        )
        .then((res) => {
          alert(res.data.message);
          updateData(true);
        })
        .catch((err) => {
          console.log(err);
        });
      handleImageDialog("", false);
    } else {
      handleImageDialog("", false);
    }
  };

  // Delete File with dialog box confirmation

  const [fileDiallog, setFileDialog] = useState({
    message: "",
    isLoding: false,
  });

  const fileIdRef = useRef();

  const handleFileDialog = (message, isLoding) => {
    setFileDialog({
      message,
      isLoding,
    });
  };

  const areYouSureDeleteFile = (choose) => {
    if (choose) {
      axios
        .delete(
          `http://localhost:7000/fi/deleteFile/${fileIdRef.current}/${userid}`
        )
        .then((res) => {
          alert(res.data.message);
          updateData(true);
        })
        .catch((err) => {
          console.log(err);
        });
      handleFileDialog("", false);
    } else {
      handleFileDialog("", false);
    }
  };

  const handleDeleteFile = (e, id, title) => {
    e.preventDefault();
    handleFileDialog(`Are you sure you want to delete "${title}" file?`, true);
    fileIdRef.current = id;
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="main">
          <div>
            <h4 className="heading_profile">
              Welcome {myProfile.username}, your details are...
            </h4>
            <div className="container_profile">
              <div className="container_profile__username">
                User Name: {myProfile.username}
              </div>
              <div className="container_profile__email">
                Email: {myProfile.email}
              </div>
              <div className="container_profile__mobile">
                Mobile: {myProfile.mobile}
              </div>
              <button className="btn btn-warning  btn-sm" onClick={userUpdateHandler}>
                Update Details
              </button>
              <div className={updateuserBox ? "userDetailsBoxOpen" : "userDetailsBoxClosed"}>
                {updateuserBox && (
                  <UpdateUserDetails token={token} userid={userid} updateCurrentUserDetails={updateCurrentUserDetails} />
                )}
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className={isTableOrMobile ? "flex-column" : "flex_row"}>
            <div className="flex_column" style={{ alignItems: "center", margin: "auto" }}>
              <h4 className="data_profile">Images upload by you</h4>
              <div>
                {images &&
                  images.map((data, index) => {
                    return (
                      <Card
                        className="card"
                        key={index}
                      >
                        <Card.Title className="card_title">
                          {myProfile.username} :
                        </Card.Title>
                        <Card.Img
                          variant="top"
                          src={`http://localhost:7000/fi/showImage/${data.image.split("\\")[1]
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
                            <div style={{ marginLeft: "10px" }}>
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
                          {imageCommentBox && data._id === imageCommentValues.imageId && (
                            <ImageComment
                              userId={userid}
                              imageId={imageCommentValues.imageId}
                              comments={imageCommentValues.imageComments}
                              socket={socket}
                            />
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => handleImageUpdate(e, data._id, data.title)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            style={{ marginLeft: "7px" }}
                            onClick={(e) =>
                              handleDeleteImage(e, data._id, data.title)
                            }
                          >
                            Delete
                          </Button>
                          {updateImageBox && updateImageData.updateImageId === data._id && (
                            <UpdateImage
                              className="update_box-transition"
                              title={updateImageData.title}
                              imageId={updateImageData.updateImageId}
                              userId={userid}
                              updateData={updateData}
                            ></UpdateImage>
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </div>
            <div className="flex_column" style={{ alignItems: "center", margin: "auto" }}>
              <h4 className="data_profile">Files upload by you</h4>
              <div>
                {files &&
                  files.map((data, index) => {
                    return (
                      <Card
                        className="card"
                        key={index}
                      >
                        <Card.Title className="card_title">
                          {myProfile.username} :
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
                            <div style={{ marginLeft: "10px" }}>
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
                          {fileCommentBox && data._id === fileCommentValues.fileId && (
                            <FileComment
                              userId={userid}
                              fileId={fileCommentValues.fileId}
                              comments={fileCommentValues.fileComments}
                              socket={socket}
                            />
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => handleFileUpdate(e, data._id, data.title)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            style={{ marginLeft: "7px" }}
                            onClick={(e) =>
                              handleDeleteFile(e, data._id, data.title)
                            }
                          >
                            Delete
                          </Button>
                          {updateFileBox && updateFileData.updateFileId === data._id && (
                            <UpdateFile
                              title={updateFileData.title}
                              fileId={updateFileData.updateFileId}
                              userId={userid}
                              updateData={updateData}
                            ></UpdateFile>
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
          {imageDialog.isLoding && (
            <DeleteDialogBox
              onDialog={areYouSureDeleteImage}
              message={imageDialog.message}
            />
          )}
          {fileDiallog.isLoding && (
            <DeleteDialogBox
              onDialog={areYouSureDeleteFile}
              message={fileDiallog.message}
            />
          )}
        </div>
      ) : <PageNotFound />}
    </div>
  );
};

export default MyProfile;