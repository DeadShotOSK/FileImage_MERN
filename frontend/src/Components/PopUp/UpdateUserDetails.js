import React, { useState } from "react";
import axios from "axios";

import "./UpdateUserDetails.css"

const UpdateUserDetails = ({ token, userid }) => {
    const [updateData, setUpdateData] = useState({
        newUserName: "",
        mobile: "",
    });

    const updateDetails = (e) => {
        e.preventDefault();
        const headers = { Authorization: `Bearer ${token}` };
        axios
            .put(`http://localhost:7000/users/updatedetails/${userid}`, updateData, {
                headers,
            })
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        setUpdateData({
            ...updateData,
            [name]: value,
        });
    };
    return (
        <React.Fragment>
            <form className="formUpdate" style={{ marginTop: "5px" }} onSubmit={updateDetails}>
                <h5>Update Details</h5>
                <div className="username">
                    <label>Name</label>
                    <input
                        type="text"
                        name="newUserName"
                        value={updateData.newUserName}
                        placeholder="new name"
                        onChange={handleChange}
                    />
                </div>
                <div className="username">
                    <label>Mobile</label>
                    <input
                        type="text"
                        name="mobile"
                        value={updateData.mobile}
                        placeholder="new mobile"
                        onChange={handleChange}
                    />
                </div>
                <button className="btn btn-warning  btn-sm" type="submit">
                    Update
                </button>
            </form>
        </React.Fragment>
    );
}

export default UpdateUserDetails;