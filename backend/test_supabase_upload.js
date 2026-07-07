require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPush() {
    console.log("Testing Supabase upload...");
    
    const { data, error } = await supabase.storage
        .from("codeVault-files") 
        .upload(`test/test.txt`, "hello world", {
            upsert: true
        });
    
    if (error) {
        console.error("Upload Error:", error);
    } else {
        console.log("Upload Success:", data);
    }
}

testPush();
