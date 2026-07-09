const express = require("express");
const passwordController = require("../controllers/passwordController");

const passwordRouter = express.Router();

passwordRouter.post("/forgot", passwordController.forgotPassword);
passwordRouter.post("/reset", passwordController.resetPassword);

module.exports = passwordRouter;
