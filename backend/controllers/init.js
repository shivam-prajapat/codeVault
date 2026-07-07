const fs = require("fs").promises;
const path = require('path')


async function initRepo(repoID) {
    const repoPath = path.resolve(process.cwd(), ".gitVault");
    const commitsPath = path.join(repoPath, "commit");

    try{
        await fs.mkdir(repoPath, { recursive: true});
        await fs.mkdir(commitsPath, { recursive: true});
        
        const config = { bucket: process.env.S3_BUCKET };
        if (repoID) config.repoID = repoID;

        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify(config)
        );

        console.log("Repository initialised!");

    }catch(err){
        console.error("Erorr initialising repository", err);

    }
}

module.exports = {initRepo};