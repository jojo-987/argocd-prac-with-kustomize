const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config()

const environment = process.env.ENV || 'dev'; 

const config = {
    dev: {
        port: 5000,
        data: { message: "Welcome to the DEVELOPMENT environment version 2", debugMode: true }
    },
    qa: {
        port: 5001,
        data: { message: "Welcome to the QA environment", automatedTests: "ready" }
    }
};

const activeConfig = config[environment] || config.dev;

app.get('/api/data', (req, res) => {
    res.json({
        status: "success",
        environment: environment,
        payload: activeConfig.data
    });
});

app.listen(activeConfig.port, () => {
    console.log(`Server running in [${environment.toUpperCase()}] mode on port ${activeConfig.port}`);
});

