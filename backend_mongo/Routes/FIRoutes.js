const express = require('express');
const multer = require('multer');
const uuid = require('uuid');

const FIController = require('../Controller/FIController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'UploadFile/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'UploadImage/')
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuid.v4() + '.' + ext);
    }
})

const uploadImage = multer({ limits: 500000, storage: storage2 });

router.get('/getAllFiles', FIController.getAllFiles); // done

router.get('/getUploadedFile/:fileName', FIController.getUploadedFile); // done

router.post('/createImage/:userId', uploadImage.single("file"), FIController.createImage); // done

router.get('/getAllImages', FIController.getAllImages); // done

router.get('/showImage/:path', FIController.showImage); // done

router.put('/likeImage/:userId/:imageId', FIController.likeImage);

router.put('/dislikeImage/:userId/:imageId', FIController.dislikeImage);

router.put('/likeFile/:userId/:fileId', FIController.likeFile);

router.put('/dislikeFile/:userId/:fileId', FIController.dislikeFile);

router.delete('/deleteImage/:imageId/:userId', FIController.deleteImageById);

router.delete('/deleteFile/:fileId/:userId', FIController.deleteFileById);

router.put('/updateImage/:imageId/:userId', FIController.updateImageById);

router.put('/updateFile/:fileId/:userId', FIController.updateFileById);

router.put('/imageComment', FIController.imageComment);

router.put('/fileComment', FIController.fileComment);

router.get('/imageComment', FIController.deleteImageComment);

module.exports = router;