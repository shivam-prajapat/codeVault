async function test() {
    try {
        const fetch = require("node-fetch"); // node 18+ has native fetch, but let's just use it
        const res = await fetch("http://localhost:3000/repo/user/6a48ddead66ab97bf77697ed");
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", data);
    } catch(err) {
        console.error("Fetch Error:", err);
    }
}
test();
