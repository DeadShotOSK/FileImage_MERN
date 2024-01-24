import React from "react";

import './PageNotFound.css'
// import axios from "axios";
// import { useParams } from "react-router-dom";

const PageNotFound = () => {

    // useEffect(() => {
    //     axios.get(`http://localhost:5000/${params}`).then((res) => {
    //         alert(res.data.message);
    //         console.log("res: ", res.data)
    //     }).catch((err) => {
    //         console.log(err);
    //     })
    // })

    return (
        <>
            <div className="pagenotfound">
                <h1 className="error">404 Error</h1>
                <h1>Page Not Found</h1>
                <h5>Please login to access this page</h5>
            </div>
        </>
    )
}

export default PageNotFound;