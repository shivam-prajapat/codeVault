const fs = require("fs").promises;
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".gitVault");
    const commitsPath = path.join(repoPath, "commit");

    try {
        const { data: commits, error } = await supabase.storage.from("codeVault-files").list();
        
        if (error) {
            console.error("Error fetching commits:", error);
            return;
        }

        for (const commit of commits) {
            const commitID = commit.name;
            const commitDir = path.join(commitsPath, commitID);
            
            await fs.mkdir(commitDir, { recursive: true });

            const { data: files, error: filesError } = await supabase.storage
                .from("codeVault-files")
                .list(commitID);
            
            if (filesError) {
                console.error(`Error fetching files for commit ${commitID}:`, filesError);
                continue;
            }

            for (const file of files) {
                const { data: fileData, error: downloadError } = await supabase.storage
                    .from("codeVault-files")
                    .download(`${commitID}/${file.name}`);
                
                if (downloadError) {
                    console.error(`Error downloading file ${file.name}:`, downloadError);
                    continue;
                }

                const buffer = Buffer.from(await fileData.arrayBuffer());
                await fs.writeFile(path.join(commitDir, file.name), buffer);
                console.log(`Downloaded ${file.name} for commit ${commitID}`);
            }
        }
        console.log("Pull completed successfully!");
    } catch (err) {
        console.error("Error pulling from Supabase:", err);
    }
}

module.exports = { pullRepo };