import React, { useState } from "react";
import { MDBInputGroup, MDBInput } from "mdb-react-ui-kit";
import axios from "axios";
import Button from "react-bootstrap/Button";

import './Comment.css';

const ImageComment = (props) => {
  const [data, setData] = useState({
    text: "",
    userId: "",
    imageId: "",
  });

  const onChangeHandler = (e) => {
    setData({
      text: e.target.value,
      userId: props.userId,
      imageId: props.imageId,
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!data.text) {
      alert("Please write something!");
    } else {
      axios
        .put("http://localhost:7000/fi/imageComment", data)
        .then((res) => {
          // alert(res.data.message); 
          props.socket.emit("ImageComment", res.data.allComments)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <div className="outer_div">
        <div className="flex_column">
          {props.comments.map((data, index) => {
            return (
              <div
                key={index}
                className="flex_row"
              >
                <b className="username">{data.postedBy.username}: </b>
                <p className="text">
                  {data.text}
                </p>
                <i className="date">
                  {data.created}
                </i>
              </div>
            );
          })} 
        </div>
        <form>
          <div className="flex_row">
            <MDBInputGroup>
              <MDBInput placeholder="Comment here" onChange={onChangeHandler} className="form_input" />
            </MDBInputGroup>
            <Button variant="primary" size="sm" onClick={onSubmitHandler} className="form_input">
              Post
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ImageComment;