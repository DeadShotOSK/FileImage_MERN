import React from "react";
import axios from "axios";
import { BsFillHeartbreakFill } from "react-icons/bs";

import './LikeDislike.css';

const DisLikeButton = (props) => {
    const handleDislike = (e) => {
        axios
            .put(`http://localhost:7000/fi/dislikeFile/${props.userId}/${props.fileId}`)
            .then((res) => { 
                props.socket.emit("likeAndDislikeFile", res.data.totalLikes);
             }).catch((err) => {
                console.log(err)
            })
    }
    return (
        <>
            <BsFillHeartbreakFill className="dislike" color={props.colour} size="22" onClick={handleDislike} />
        </>
    );
}

export default DisLikeButton;