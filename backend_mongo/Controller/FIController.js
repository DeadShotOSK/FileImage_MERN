const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const { UserModel, ImageModel, FileModel } = require("../Module/Schema");

exports.getUploadedFile = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const dir = path.join(__dirname, "../UploadFile", fileName);
    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Type", `application/${mimeTypes}`);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.status(200).sendFile(dir);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
};

exports.showImage = (req, res) => {
  try {
    const imagepath = req.params.path;
    const dir = path.join(__dirname, "../UploadImage", imagepath);
    res.setHeader("Content-Type", "image/jpeg");
    // res.setHeader("Content-Type", `application/${mimeTypes}`);
    res.setHeader("Content-Disposition", `attachment; filename=${imagepath}`);
    res.status(200).sendFile(dir);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
};

exports.createImage = async (req, res) => {
  try {
    const { title, caption, radio } = req.body;
    const image = req.file;
    const userId = req.params.userId;
    const path = req.file.path;
    const user = await UserModel.findOne({ _id: userId });

    if (user && image && radio === "Image") {
      const newImage = await ImageModel.create({
        title,
        caption,
        image: path,
        creator: userId,
      });

      const data = await ImageModel.find(
        { creator: userId },
        { title: 0, caption: 0, image: 0, like: 0, __v: 0, creator: 0 }
      );

      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { images: data } },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        message: "Image uploaded successfully",
      });
    } else {
      const newFile = await FileModel.create({
        title,
        caption,
        file: path,
        creator: userId,
      });

      const data = await FileModel.find(
        { creator: userId },
        { title: 0, caption: 0, file: 0, like: 0, __v: 0, creator: 0 }
      );

      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { files: data } },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        message: "File uploaded successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const imageData = await ImageModel.find().populate([
      {path: "creator", select: ["username"]},
      {path: "comments.postedBy", select: ["username"]}
    ]);

    if (imageData.length > 0) {
      res.status(200).json({
        status: "true",
        message: "Images Fatched Successfully",
        imageData,
      });
    } else {
      res.status(200).json({
        status: "false",
        message: "Images not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const allFiles = await FileModel.find().populate([
      {path: "creator", select: ["username"]},
      {path: "comments.postedBy", select: ["username"]}
    ]);

    if (allFiles.length > 0) {
      res.status(200).json({
        status: "true",
        message: "Files Fatched Successfully",
        allFiles,
      });
    } else {
      res.status(200).json({
        status: "false",
        message: "Files not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
};

exports.likeImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const imageId = req.params.imageId;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
      const totalLike = await ImageModel.findOneAndUpdate(
        { _id: imageId },
        { $addToSet: { like: userId } },
        { new: true }
      );
      const totalLikes = await ImageModel.find().populate([
        {path: "creator", select: ["username"]},
        {path: "comments.postedBy", select: ["username"]}
      ]);
      res.status(200).json({
        status: "success",
        totalLikes,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
};

exports.dislikeImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const imageId = req.params.imageId;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
      const removeI = await ImageModel.findOneAndUpdate(
        { _id: imageId },
        { $pull: { like: userId } },
        { new: true }
      );
      const removeId = await ImageModel.find().populate([
        {path: "creator", select: ["username"]},
        {path: "comments.postedBy", select: ["username"]}
      ]);
      res.status(200).json({
        status: "success",
        removeId,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.likeFile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const fileId = req.params.fileId;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
      const totalLike = await FileModel.findOneAndUpdate(
        { _id: fileId },
        { $addToSet: { like: userId } },
        { new: true }
      );

      const totalLikes = await FileModel.find().populate([
        {path: "creator", select: ["username"]},
        {path: "comments.postedBy", select: ["username"]}
      ]);

      res.status(200).json({
        status: "success",
        totalLikes,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.dislikeFile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const fileId = req.params.fileId;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
      const totalLike = await FileModel.findOneAndUpdate(
        { _id: fileId },
        { $pull: { like: userId } },
        { new: true }
      );
      const totalLikes = await FileModel.find().populate([
        {path: "creator", select: ["username"]},
        {path: "comments.postedBy", select: ["username"]}
      ]);
      res.status(200).json({
        status: "success",
        totalLikes,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.deleteImageById = async (req, res) => {
  try {
    const ImageId = req.params.imageId;
    const UserId = req.params.userId;

    const image = await ImageModel.findOneAndDelete({ _id: ImageId, creator: UserId });
    const user = await UserModel.findOneAndUpdate({ _id: UserId }, { $pull: { images: ImageId } });

    if (user && image) {
      res.status(200).json({
        message: "Image deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "Image not found!"
      });
    }

  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.deleteFileById = async (req, res) => {
  try {
    const FileId = req.params.fileId;
    const UserId = req.params.userId;

    const file = await FileModel.findOneAndDelete({ _id: FileId, creator: UserId });
    const user = await UserModel.findOneAndUpdate({ _id: UserId }, { $pull: { files: FileId } });

    if (file && user) {
      res.status(200).json({
        message: "File deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "File not found!"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.updateImageById = async (req, res) => {
  try {
    const ImageId = req.params.imageId;
    const UserId = req.params.userId;

    const { title, caption } = req.body;

    const image = await ImageModel.findOneAndUpdate(
      {_id: ImageId, creator: UserId},
      {title: title, caption: caption},
      {new: true}
    )

    if (image) {
      res.status(200).json({
        message: "Title and Caption updated successfully."
      })
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.updateFileById = async (req, res) => {
  try {
    const FileId = req.params.fileId;
    const UserId = req.params.userId;

    const { title, description } = req.body;

    const file = await FileModel.findOneAndUpdate(
      {_id: FileId, creator: UserId},
      {title: title, description: description},
      {new: true}
    )

    if (file) {
      res.status(200).json({
        message: "Title and Description updated successfully."
      })
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.imageComment = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.body.userId
    };
    const imageId = req.body.imageId;

    const postComment = await ImageModel.findOneAndUpdate(
      {_id: imageId},
      {$push: { comments: comment }},
      {new: true}
    )
    const allComments = await ImageModel.find().populate([
      {path: "creator",select: ["username"]},
      {path: "comments.postedBy", select: ["username"]}
    ]);

    if (postComment) {
      res.status(200).json({
        message: "comment posted successfully",
        allComments
      })
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.fileComment = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.body.userId
    };
    const fileId = req.body.fileId;

    const postComment = await FileModel.findOneAndUpdate(
      {_id: fileId},
      {$push: { comments: comment }},
      {new: true}
    )
    const allComments = await FileModel.find().populate([
      {path: "creator",select: ["username"]},
      {path: "comments.postedBy", select: ["username"]}
    ]);

    if (postComment) {
      res.status(200).json({
        message: "comment posted successfully",
        allComments
      })
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}

exports.deleteImageComment = async (req, res) => {
  try {
    // const { imageId, postedById, commentId } = req.body;
    

    // if () {
    //   res.status(200).json({
        
    //   })
    // }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Something Went Wrong!",
    });
  }
}