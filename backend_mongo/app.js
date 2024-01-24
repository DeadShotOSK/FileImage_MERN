const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const userRouter = require("./Routes/UserRoutes"); // all user related routes
const FIRouter = require("./Routes/FIRoutes"); // all files and images related routes

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", userRouter);
app.use("/fi", FIRouter);

// For real-time data update
io.on('connection', (socket) => {
    // console.log("A user connected", socket.id)
    // Image Like/Dislike
    socket.on("likeAndDislike", (data) => {
        io.emit("updated-likeAndDislike", data);
    }),
    // File Like/Dislike
    socket.on("likeAndDislikeFile", (data) => {
        io.emit("updated-likeAndDislikeFile", data)
    })
    // Image Comment
    socket.on("ImageComment", (data) => {
        io.emit("update-ImageComment", data)
    })
    // File Comment
    socket.on("FileComment", (data) => {
        io.emit("update-FileComment", data);
    })
});


exports.io = io;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://FIUser:6Tdr5Vfc9WMuI3sr@cluster0.eqb0jk1.mongodb.net/pc", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        server.listen(PORT,() => {
            console.log(`Server is running on port ${PORT}`);
        })
        console.log("DB Connected");
    }
});