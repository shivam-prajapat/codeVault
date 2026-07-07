const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), ".gitVault");
    const commitDir = path.join(repoPath, "commit", commitID);

    try {
        const commitFiles = await fs.readdir(commitDir);
        
        for (const file of commitFiles) {
            if (file !== "commit.json") {
                await fs.copyFile(
                    path.join(commitDir, file),
                    path.join(process.cwd(), file)
                );
            }
        }
        
        console.log(`Successfully reverted to commit: ${commitID}`);
    } catch (err) {
        console.error("Error reverting to commit:", err);
    }
}

module.exports = { revertRepo };