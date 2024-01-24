const express = require('express');

const userController = require('../Controller/UserController'); 

const authToken = (req, res, next) => {
    const brarerHeader = req.headers['authorization']; 
    if (brarerHeader !== null && brarerHeader !== undefined) {
        const token = brarerHeader.split(" ")[1];
        req.token = token;
        next();
    } else {
        res.status(401).json({
            message: "Token is invalid" 
        })
    }
}

const router = express.Router();

router.post('/register', userController.registerUser); // done

router.post('/login', userController.loginUser); // done

router.get('/allusers', userController.getAllUser); // done

router.get('/userdetails', authToken, userController.userDetails); // done

router.get('/userProfile/:userId', authToken, userController.getUserProfile); // done
1
router.put('/updatedetails/:userId', authToken, userController.updateDetails); // done

module.exports = router; 