const axios = require('axios');

async function run() {
    try {
        const res = await axios.post('http://localhost:5000/register', {
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        });
        console.log("Register:", res.data);
    } catch(e) {
        console.log("Register Error:", e.response ? e.response.data : e.message);
    }

    try {
        const res2 = await axios.post('http://localhost:5000/login', {
            email: "test@example.com",
            password: "password123"
        });
        console.log("Login:", res2.data);
    } catch(e) {
        console.log("Login Error:", e.response ? e.response.data : e.message);
    }
}
run();
