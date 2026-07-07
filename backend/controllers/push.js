const fs = require("fs").promises;
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".gitVault");
    const commitsPath = path.join(repoPath, "commit");

    let repoID = null;
    try {
        const configData = await fs.readFile(path.join(repoPath, "config.json"), "utf8");
        const config = JSON.parse(configData);
        repoID = config.repoID;
    } catch (err) {
        // config might not have repoID or not exist
    }

    try {
        const commitDirs = await fs.readdir(commitsPath);
        
        for (const commitID of commitDirs) {
            const commitPath = path.join(commitsPath, commitID);
            const files = await fs.readdir(commitPath);
            
            for (const file of files) {
                // Ignore internal commit.json file for UI display
                if (file === "commit.json") continue;

                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);
                
                const { data, error } = await supabase.storage
                    .from("codeVault-files") 
                    .upload(`${commitID}/${file}`, fileContent, {
                        upsert: true
                    });
                
                if (error) {
                    console.error("Error uploading file:", error);
                } else {
                    console.log(`Uploaded ${file} for commit ${commitID}`);
                    
                    if (repoID) {
                        try {
                            const apiUrl = process.env.API_URL || 'http://localhost:3000';
                            const response = await fetch(`${apiUrl}/repo/update/${repoID}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ 
                                    content: file,
                                    fileData: fileContent.toString('utf8')
                                })
                            });
                            if (!response.ok) {
                                console.error(`Failed to register ${file} in MongoDB`);
                            }
                        } catch (err) {
                            console.error(`Error reaching Express API: ${err.message}`);
                        }
                    }
                }
            }
            
            // Clear the commit directory after it has been pushed successfully
            await fs.rm(commitPath, { recursive: true, force: true });
            console.log(`Commit ${commitID} removed locally after push.`);
        }
        console.log("Push completed successfully!");
    } catch (err) {
        console.error("Error pushing to Supabase:", err);
    }
}

module.exports = { pushRepo };