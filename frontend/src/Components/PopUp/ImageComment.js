import React, { useEffect, useState } from "react";
import { MDBInputGroup, MDBInput } from "mdb-react-ui-kit";
import axios from "axios";
import Button from "react-bootstrap/Button";
import EmojiPicker from 'emoji-picker-react';
import { CiFaceSmile } from 'react-icons/ci';

import './Comment.css';

const ImageComment = (props) => {
  const [data, setData] = useState({
    text: "",
    userId: "",
    imageId: "",
  });

  const [pickkBox, setPickBox] = useState(false);
  const [input, setInput] = useState("");
  const handlePick = () => {
    setPickBox(!pickkBox);
  }
  const clickEmoji = (e) => {
    setInput((prevInput) => prevInput + e.emoji);
  }

  useEffect(() => {
    setData({
      text: input,
      userId: props.userId,
      imageId: props.imageId,
    });
  }, [input, props.userId, props.imageId]);

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
              <MDBInput placeholder="Comment here" value={input} onChange={(e) => setInput(e.target.value)} className="form_input" />
            </MDBInputGroup>
            <CiFaceSmile className="emoji-picker" size={20} onClick={handlePick}></CiFaceSmile>
            <Button variant="primary" size="sm" onClick={onSubmitHandler} className="form_input">
              Post
            </Button>
          </div>
            {pickkBox && <EmojiPicker onEmojiClick={clickEmoji} />}
        </form>
      </div>
    </>
  );
};

export default ImageComment;