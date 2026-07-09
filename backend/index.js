#!/usr/bin/env node
const dotenv = require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const mainRouter = require("./routes/main.router");



const yargs = require('yargs');
const { hideBin } = require("yargs/helpers");
const { Server } = require("socket.io");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { commitRepo } = require("./controllers/commit");
const { revertRepo } = require("./controllers/revert");


yargs(hideBin(process.argv))
.command('start', "starts a new server!", {}, startServer )
.command('init [repoID]', "Initialise a new repository!", (yargs)=>{
    yargs.positional("repoID",{
        describe : "MongoDB Repository ID to link to",
        type: "string",
    });
}, (argv)=>{
    initRepo(argv.repoID);
} )

.command("add <file>", "Add a file to the repository!", (yargs)=>{
    yargs.positional("file",{
        describe : "File to add to the staging area",
        type: "string",
    });
}, (argv)=>{
    addRepo(argv.file);
} )

.command("commit <message>", "commit the staged file!", (yargs)=>{
    yargs.positional("message",{
        describe : "commit message",
        type: "string",
    });
}, (argv)=>{
    commitRepo(argv.message);
} )

.command("push", "push commit to S3", {}, pushRepo)

.command("pull", "pull commit from S3", {}, pullRepo)

.command("revert <commitID>", "revert to a specific commit", (yargs)=>{
    yargs.positional("commitID",{
        describe : "commit ID to revert to ",
        type: "string",
    });
}, (argv)=>{
    revertRepo(argv.commitID);
} )

.demandCommand(1, " You need atleast one command")
.help().argv;

function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;


    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose.connect(mongoURI).then(()=>{
        console.log("MongoDB Connected !")
    }).catch((err)=>{
        console.error("Unable to connect : ", err);
    })

    app.use(cors({origin:"*"}));
    app.use("/",mainRouter);
    

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET","POST"],
        },
    }
    );

    io.on("connection", (socket)=>{
        socket.on("joinRoom", (userID)=>{
            user = userID;
            console.log("====");
            console.log(user);
            console.log("====");
            socket.join(user);



        })
    });

    const db = mongoose.connection;

    db.once("open", async () => {
        console.log("CRUD operations called");
    })

    httpServer.listen(port, ()=>{
        console.log(`Server is running on PORT ${port}`);
    })


} 