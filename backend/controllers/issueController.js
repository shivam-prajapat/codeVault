const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function  createIssue(req,res){
    
    const {title, description} = req.body;
    const {id} = req.params;

    try{
        const issue = new Issue({
        title,
        description,
        repository: id,

    });

    await issue.save();

    // Log contribution
    const repository = await Repository.findById(id);
    if (repository) {
        await User.findByIdAndUpdate(repository.owner, {
            $push: { contributions: new Date() }
        });
    }

    res.status(201).json(issue);
    } catch(err){
        console.error("Error creating issue",err.message);
        res.status(500).send("Server error");
    }

};


async function updateIssueId (req, res)  {
    const { id } = req.params;
    const {title, description, status} = req.body;

    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({error: "Issue not found"});
        }

        issue.title = title;
        issue.description = description;
        issue.status = !status;

        await issue.save();

        res.json(issue, {message : "Issue updated"});



    } catch(err){
        console.error("Error updating issue",err.message);
        res.status(500).send("Server error");
    }
};

async function deleteIssueById (req, res) {
    
    const { id } = req.params;

    try{
        const issue = await Issue.findByIdAndDelete(id);

        if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }

        res.json({message:"Issue Deleted"});


    } catch(err){
        console.error("Error updating issue",err.message);
        res.status(500).send("Server error");
    }

}; 

async function getAllIssues (req, res) {
    const {id} = req.params;

    try{
        const issues = await Issue.find({repository: id});

        if(!issues || issues.length === 0){
            return res.status(404).json({error:"Issues not found"});
        }
        res.status(200).json(issues);
    } catch(err){
        console.error("Error fetching issues",err.message);
        res.status(500).send("Server error");
    }
};

async function getUserIssues (req, res) {
    const { userId } = req.params;
    try {
        const userRepos = await Repository.find({ owner: userId });
        const repoIds = userRepos.map(repo => repo._id);
        const issues = await Issue.find({ repository: { $in: repoIds } });
        res.status(200).json(issues);
    } catch (err) {
        console.error("Error fetching user issues", err.message);
        res.status(500).send("Server error");
    }
};

async function getIssueById (req, res) {
        const { id } = req.params;
    

    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({error: "Issue not found"});
        }
        res.json(issue, {message : "Issue updated"});



    } catch(err){
        console.error("Error updating issue",err.message);
        res.status(500).send("Server error");
    }
};

module.exports = {
    createIssue,
    updateIssueId,
    deleteIssueById,
    getAllIssues,
    getIssueById,
    getUserIssues
}
