const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
const CVE = require('./cve.schema');
const cors = require('cors');
app.use(cors());
mongoose.connect('mongodb://127.0.0.1:27017/db1')
    .then(() => {
        console.log("Connected to the database");
     
        insertDataIntoDatabase();
    })
    .catch((error) => {
        console.error("Error connecting in database:", error);
    });

async function insertDataIntoDatabase() {
    try {
        const data = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');
        if (data.data) {
            
            const result = await CVE.insertMany(data.data.vulnerabilities); 
            if (result) {
                console.log('Data Inserted into the database');
            }
        }
    } catch (error) {
        console.error('Error inserting data into database:', error);
    }
}

app.get('/result', async (req, res) => {
    try {
        const data = await CVE.find({}, {
            "cve.id": 1,
            "cve.sourceIdentifier": 1,
            "cve.published": 1,
            "cve.lastModified": 1,
            "cve.vulnStatus": 1
        });
        if (data.length > 0)
            return res.status(200).send(data);
        return res.status(404).send({ message: "Try again" });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).send({ message: "Something went wrong internal server error" });
    }
});

app.listen(5000, () => {
    console.log("Port 5000 is Connected!!");
});
