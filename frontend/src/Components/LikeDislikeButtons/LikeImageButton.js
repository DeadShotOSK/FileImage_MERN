import React from "react";
import axios from "axios";
import { GoHeartFill } from "react-icons/go";

import './LikeDislike.css';

const LikeImageButton = (props) => {

  const handleLike = (e) => {
    axios
      .put(
        `http://localhost:7000/fi/likeImage/${props.userId}/${props.imageId}`
      )
      .then((res) => {
        props.socket.emit("likeAndDislike", res.data.totalLikes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <GoHeartFill
        className="like"
        color={props.colour}
        size="25"
        onClick={handleLike}
      />
    </>
  );
};

export default LikeImageButton;