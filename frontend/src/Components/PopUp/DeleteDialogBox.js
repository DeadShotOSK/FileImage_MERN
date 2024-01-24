import React from "react";
import { RxCross2 } from 'react-icons/rx';

const DeleteImageDialog = ({ message, onDialog }) => {
    return (
        <>
            <div style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "end",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "ghostwhite",
                    padding: "20px",
                    borderRadius: "10px",
                }}>
                    <div style={{ backgroundColor: "#dc3545", borderRadius: "3px" }}>
                        <RxCross2 size={23} color="white" onClick={() => onDialog(false)} style={{ cursor: "pointer" }} />
                    </div>
                    <br />
                    <h3 style={{ color: "#111" }}> {message} </h3>
                    <br />
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button className="btn btn-danger btn-sm" onClick={() => onDialog(true)} style={{ marginRight: "5px", cursor: "pointer" }}>Yes</button>
                        <button className="btn btn-success btn-sm" onClick={() => onDialog(false)} style={{ cursor: "pointer" }}>No</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteImageDialog;