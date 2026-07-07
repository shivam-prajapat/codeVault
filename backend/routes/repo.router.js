const express = require("express");
const repoController = require('../controllers/repoController');

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository );
repoRouter.get("/repo/all", repoController.getAllRepositories );
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName );
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById );
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoryForCurrentUser );
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById );
repoRouter.patch("/repo/toggle/:id", repoController.toggleVissibilityById );



module.exports = repoRouter;