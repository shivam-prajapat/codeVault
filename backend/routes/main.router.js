const express = require("express");
const userRouter = require("./user.router")
const repoRouter = require("./repo.router")
const issueRouter = require("./issue.route");
const aiRouter = require("./ai.router");
const passwordRouter = require("./password.router");

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use("/ai", aiRouter);
mainRouter.use("/password", passwordRouter);

mainRouter.get("/",(req, res)=>{
        res.send("Welcome");
});

module.exports = mainRouter;