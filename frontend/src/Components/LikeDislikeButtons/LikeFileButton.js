import React from "react";
import axios from "axios";
import { GoHeartFill } from "react-icons/go";

const LikeFileButton = (props) => {

    const handleLike = (e) => { 
        axios
            .put(`http://localhost:7000/fi/likeFile/${props.userId}/${props.fileId}`)
            .then((res) => {
                props.socket.emit("likeAndDislikeFile", res.data.totalLikes);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <>
            <GoHeartFill style={{ cursor: "pointer" }} color={props.colour} size="25" onClick={handleLike} />
        </>
    );
}

export default LikeFileButton;