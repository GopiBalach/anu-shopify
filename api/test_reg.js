const axios = require('axios');

async function testSignup() {
    const holdData = {
        username: "testuser123",
        password: "password123",
        name: "Test",
        surname: "User",
        email: "test@example.com",
        telephone: "1234567890",
        location: "Test City",
        country: "Greece",
        taxnumber: 123456789,
        sellerRating: 0, saleCount: 0, bidderRating: 0, buyCount: 0
    };

    try {
        const response = await axios.post("http://localhost:33123/auth/", holdData);
        console.log("Success:", response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testSignup();
