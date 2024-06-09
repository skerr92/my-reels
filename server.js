const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Change this to a secure secret key

app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('local.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        value TEXT,
        footprint TEXT,
        description TEXT,
        quantity INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        description TEXT,
        github TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware for checking JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Register a new user
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(sql, [username, hashedPassword], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        const token = jwt.sign({ id: this.lastID, username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
});

// User login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Get all parts for the authenticated user
app.get('/api/parts', authenticateJWT, (req, res) => {
    const sql = 'SELECT * FROM parts WHERE user_id = ?';
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Add a new part for the authenticated user
app.post('/api/parts', authenticateJWT, (req, res) => {
    const { name, value, footprint, description, quantity } = req.body;
    const sql = 'INSERT INTO parts (user_id, name, value, footprint, description, quantity) VALUES (?, ?,?, ?, ?, ?)';
    db.run(sql, [req.user.id, name, value, footprint, description, quantity], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID, name, value, footprint, description: description, quantity }
        });
    });
});

// Update a part for the authenticated user
app.put('/api/parts/:id', authenticateJWT, (req, res) => {
    const { name, value, footprint, description, quantity } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE parts SET name = ?, value = ?, footprint = ?,description = ?, quantity = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [name, value, footprint, description, quantity, id, req.user.id], function(err) {
        if (err) {
            console.log("we failed.");
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id, name, value, footprint, description: description, quantity }
        });
    });
});

// Delete a part for the authenticated user
app.delete('/api/parts/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM parts WHERE id = ? AND user_id = ?';
    db.run(sql, [id, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'deleted', rowsAffected: this.changes });
    });
});

// Get all parts for the authenticated user
app.get('/api/projects', authenticateJWT, (req, res) => {
    const sql = 'SELECT * FROM projects WHERE user_id = ?';
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        console.log(rows);
        res.json({ data: rows });
    });
});

// Add a new project for the authenticated user
app.post('/api/projects', authenticateJWT, (req, res) => {
    console.log(req.body);
    const { name, description, github } = req.body;
    const sql = 'INSERT INTO projects (user_id, name, description, github) VALUES (?, ?, ?, ?)';
    db.run(sql, [req.user.id, name,description, github], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID, name, description: description, github }
        });
    });
});

// Update a project for the authenticated user
app.put('/api/projects/:id', authenticateJWT, (req, res) => {
    const { name,description} = req.body;
    const { id } = req.params;
    const sql = 'UPDATE projects SET name = ?,description = ?, github = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [name, description, id, github, req.user.id], function(err) {
        if (err) {
            console.log("we failed.");
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id, name, description: description }
        });
    });
});

// Delete a part for the authenticated user
app.delete('/api/projects/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM projects WHERE id = ? AND user_id = ?';
    db.run(sql, [id, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'deleted', rowsAffected: this.changes });
    });
});

app.get('/projects/:id', authenticateJWT, (req, res) => {
    console.log("getting called?");
    const { id } = req.params;
    const sql = 'SELECT * FROM projects WHERE id = ? AND user_id = ?';
    name = "";
    description = "";
    github = "";
    db.run(sql, [id, name, description, github, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({message: 'project',
                 data: { id, name, description, github}});
    });
});

// Upload and process CSV file for the authenticated user
app.post('/api/upload', authenticateJWT, upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const parts = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            parts.push(row);
        })
        .on('end', () => {
            parts.forEach(part => {
                const { name, value, footprint, description, quantity } = part;
                const sql = 'INSERT INTO parts (user_id, name, value, footprint, description, quantity) VALUES (?, ?, ?, ?, ?, ?)';
                const params = [req.user.id, name, value, footprint, description, quantity];
                db.run(sql, params, function(err) {
                    if (err) {
                        console.error(err.message);
                    }
                });
            });
            res.json({ message: 'CSV file successfully processed' });
        });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});