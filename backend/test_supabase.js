require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    console.log("Testing Supabase connection...");
    
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
        console.error("Supabase Error:", error.message);
        process.exit(1);
    }
    
    console.log("Supabase connected successfully! Buckets:");
    console.log(data);
    process.exit(0);
}

testSupabase();
