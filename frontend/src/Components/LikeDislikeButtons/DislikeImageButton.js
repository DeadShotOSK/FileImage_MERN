import React from "react";
import axios from "axios";
import { BsFillHeartbreakFill } from "react-icons/bs";

const DislikeImageButton = (props) => {
    const handleDislike = (e) => {
        axios
            .put(`http://localhost:7000/fi/dislikeImage/${props.userId}/${props.imageId}`)
            .then((res) => { 
                props.socket.emit('likeAndDislike', res.data.removeId); })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <>
            <BsFillHeartbreakFill style={{ cursor: "pointer", marginLeft: "4px" }} color={props.colour} size="22" onClick={handleDislike} />
        </>
    );
}

export default DislikeImageButton;