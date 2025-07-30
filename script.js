const express = require('express');  
const mysql = require('mysql2');  
const bodyParser = require('body-parser');  
const cors = require('cors');  
const path = require('path'); // Import path module  

const app = express();  
const PORT = process.env.PORT || 5000;  

// Middleware  
app.use(cors());  
app.use(bodyParser.json());  

// Serve static files from the public directory  
app.use(express.static(path.join(__dirname, 'public')));  

// MySQL connection  
const db = mysql.createConnection({  
    host: 'localhost',  
    user: 'root',  
    password: '',  
    database: 'contact_form',  
});  

db.connect((err) => {  
    if (err) {  
        console.error('Error connecting to MySQL:', err);  
        return;  
    }  
    console.log('Connected to MySQL');  
});  

// POST endpoint to receive form data  
app.post('/api/contact', (req, res) => {  
    const { name, email, message } = req.body;  

    // Validate input  
    if (!name || !email || !message) {  
        return res.status(400).send('All fields are required');  
    }  

    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';  
    db.query(query, [name, email, message], (err, results) => {  
        if (err) {  
            console.error('Error saving message:', err);  
            return res.status(500).send('Error saving message');  
        }  
        res.status(201).send('Message received');  
    });  
});  

// Error handling middleware  
app.use((err, req, res, next) => {  
    console.error(err.stack);  
    res.status(500).send('Something went wrong!');  
});  

app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});