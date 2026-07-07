const { GoogleGenAI } = require("@google/genai");
const Repository = require("../models/repoModel");

async function generateCodeReview(req, res) {
    const { repoId } = req.params;

    try {
        const repository = await Repository.findById(repoId);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (!repository.fileDetails || repository.fileDetails.length === 0) {
            // BACKWARD COMPATIBILITY: Fallback to Supabase if code isn't in MongoDB
            if (!repository.content || repository.content.length === 0) {
                return res.status(400).json({ error: "No code files found in this repository to review." });
            }

            const { createClient } = require("@supabase/supabase-js");
            const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
            
            // List all commit folders in the bucket
            const { data: folders } = await supabase.storage.from("codeVault-files").list();
            let downloadedFiles = [];

            if (folders) {
                for (const filename of repository.content) {
                    let fileContent = null;
                    // Search across folders to find the matching file
                    for (const folder of folders) {
                        const { data } = await supabase.storage.from("codeVault-files").download(`${folder.name}/${filename}`);
                        if (data) {
                            fileContent = await data.text();
                            break;
                        }
                    }
                    if (fileContent) {
                        downloadedFiles.push({ name: filename, data: fileContent });
                    }
                }
            }

            if (downloadedFiles.length === 0) {
                return res.status(400).json({ error: "Failed to retrieve older code files from the cloud for review." });
            }

            // Temporarily assign downloaded files so the prompt builder can use them
            repository.fileDetails = downloadedFiles;
        }

        // Initialize Gemini API
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Construct the prompt with all code files
        let prompt = `Act as an expert Senior Principal Software Engineer. Conduct a thorough code review of the following project repository.\n`;
        prompt += `Repository Name: ${repository.name}\n`;
        prompt += `Description: ${repository.description || 'N/A'}\n\n`;
        
        prompt += `Please structure your review using markdown with the following sections:\n`;
        prompt += `- **Architecture Overview**: Brief summary of what the code does.\n`;
        prompt += `- 🐞 **Bug Detection**: Identify any potential bugs or syntax errors.\n`;
        prompt += `- 🛡️ **Security Vulnerabilities**: Point out any security risks.\n`;
        prompt += `- ⚡ **Performance Improvements**: Suggest any optimizations.\n`;
        prompt += `- ✨ **Best Practices**: Give advice on code structure and maintainability.\n\n`;

        prompt += `### Repository Files:\n`;

        for (const file of repository.fileDetails) {
            prompt += `\n#### File: \`${file.name}\`\n`;
            prompt += "```javascript\n";
            prompt += file.data;
            prompt += "\n```\n";
        }

        // Call Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ review: response.text });
    } catch (err) {
        console.error("Error generating AI review:", err.message);
        res.status(500).json({ error: "Failed to generate AI review. Please check your API Key." });
    }
}

module.exports = {
    generateCodeReview
};
