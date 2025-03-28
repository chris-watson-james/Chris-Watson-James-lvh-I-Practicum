const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: "key.env" }); // Load environment variables from key.env

const app = express();
const PORT = 3000;

app.set("view engine", "pug"); // Set Pug as the template engine
app.use(express.urlencoded({ extended: true })); // Parse form data

// Home Route ("/")
app.get("/", async (req, res) => {
    try {
        // Fetch custom object records from HubSpot API
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/planets", {
            headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` },
        });

        // Pass data to homepage
        res.render("homepage", { records: response.data.results });
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).send("Error retrieving records");
    }
});

// Form Page Route ("/update-coi")
app.get("/update-coi", (req, res) => {
    res.render("update-form"); // Renders the form for adding a new record
});

// Handle Form Submission ("/update-coi")
app.post("/update-coi", async (req, res) => {
    try {
        // Get form data
        const { name, size, colour } = req.body;

        // Debugging log to verify form data before sending request
        console.log("Sending data to HubSpot:", { name, size, colour });

        // Send data to HubSpot API to create a new record
        await axios.post(
            "https://api.hubapi.com/crm/v3/objects/planets",
            {
                properties: {
                    name,
                    size,
                    colour // Ensure these match HubSpot property names
                },
            },
            { headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` } }
        );

        // Redirect back to homepage after success
        res.redirect("/");
    } catch (error) {
        console.error("Error creating record:", error.response?.data || error.message);
        res.status(500).send("Error saving record");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
