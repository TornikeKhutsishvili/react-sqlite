const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'ewr3_tfsa_g739_dfwq_234dfs_asd73'; // In production, use environment variables

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Teacher Book API',
      version: '1.0.0',
      description: 'API for managing teachers, pupils, and exams',
    },
    servers: [
      { url: `http://localhost:${PORT}` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./server.js'], // files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>Teacher Book API is running</h1>
    <p>Check the <a href="/api-docs">API Documentation (Swagger)</a></p>
  `);
});

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      subject TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS pupils (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      personal_number TEXT,
      email TEXT,
      phone TEXT,
      alternate_number TEXT,
      status TEXT,
      activity_status TEXT,
      module TEXT,
      group_name TEXT,
      credit TEXT,
      FOREIGN KEY(teacher_id) REFERENCES users(id)
    )`, () => {
      const cols = ['personal_number', 'email', 'phone', 'alternate_number', 'status', 'activity_status', 'module', 'group_name', 'credit'];
      cols.forEach(col => {
        db.run(`ALTER TABLE pupils ADD COLUMN ${col} TEXT`, () => {});
      });
    });
    db.run(`CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      time_from TEXT,
      time_to TEXT,
      FOREIGN KEY(teacher_id) REFERENCES users(id)
    )`, () => {
      db.run(`ALTER TABLE exams ADD COLUMN time_from TEXT`, () => {});
      db.run(`ALTER TABLE exams ADD COLUMN time_to TEXT`, () => {});
    });
    db.run(`CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      description TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(teacher_id) REFERENCES users(id)
    )`, () => {
      db.run(`ALTER TABLE documents ADD COLUMN content TEXT`, () => {});
    });
  }
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new teacher
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, password]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *               subject: { type: string }
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Bad request or user exists
 */
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, email, phone, password, subject } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (firstname, lastname, email, phone, password, subject) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [firstname, lastname, email, phone, hashedPassword, subject], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }

      const newUser = { id: this.lastID, firstname, lastname, email, phone, subject };
      const token = jwt.sign({ userId: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(201).json({ message: 'User registered successfully', token, user: newUser });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login for a teacher
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email } });
  });
});

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current teacher profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Unauthorized
 */
app.get('/api/profile', authenticateToken, (req, res) => {
  const sql = `SELECT id, firstname, lastname, email, phone, subject FROM users WHERE id = ?`;
  db.get(sql, [req.user.userId], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
});

/**
 * @swagger
 * /api/pupils:
 *   get:
 *     summary: Get all pupils for the current teacher
 *     tags: [Pupils]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pupils
 *   post:
 *     summary: Add a new pupil
 *     tags: [Pupils]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *     responses:
 *       201:
 *         description: Pupil added
 */
app.get('/api/pupils', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM pupils WHERE teacher_id = ?`;
  db.all(sql, [req.user.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/pupils', authenticateToken, (req, res) => {
  const { firstname, lastname, personal_number, email, phone, alternate_number, status, activity_status, module, group_name, credit } = req.body;
  if (!firstname || !lastname) return res.status(400).json({ message: 'Missing fields' });

  const sql = `INSERT INTO pupils (teacher_id, firstname, lastname, personal_number, email, phone, alternate_number, status, activity_status, module, group_name, credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [req.user.userId, firstname, lastname, personal_number, email, phone, alternate_number, status, activity_status, module, group_name, credit], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ id: this.lastID, firstname, lastname, personal_number, email, phone, alternate_number, status, activity_status, module, group_name, credit });
  });
});

app.put('/api/pupils/:id', authenticateToken, (req, res) => {
  const { firstname, lastname, personal_number, email, phone, alternate_number, status, activity_status, module, group_name, credit } = req.body;
  const { id } = req.params;
  if (!firstname || !lastname) return res.status(400).json({ message: 'Missing fields' });

  const sql = `UPDATE pupils SET firstname = ?, lastname = ?, personal_number = ?, email = ?, phone = ?, alternate_number = ?, status = ?, activity_status = ?, module = ?, group_name = ?, credit = ? WHERE id = ? AND teacher_id = ?`;
  db.run(sql, [firstname, lastname, personal_number, email, phone, alternate_number, status, activity_status, module, group_name, credit, id, req.user.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Pupil not found or unauthorized' });
    res.json({ message: 'Pupil updated successfully' });
  });
});

app.delete('/api/pupils/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM pupils WHERE id = ? AND teacher_id = ?`;
  db.run(sql, [id, req.user.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Pupil not found or unauthorized' });
    res.json({ message: 'Pupil deleted successfully' });
  });
});

/**
 * @swagger
 * /api/exams:
 *   get:
 *     summary: Get all exams for the current teacher
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams
 *   post:
 *     summary: Add a new exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, date]
 *             properties:
 *               name: { type: string }
 *               date: { type: string }
 *               timeFrom: { type: string }
 *               timeTo: { type: string }
 *     responses:
 *       201:
 *         description: Exam added
 */
app.get('/api/exams', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM exams WHERE teacher_id = ?`;
  db.all(sql, [req.user.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/exams', authenticateToken, (req, res) => {
  const { name, date, timeFrom, timeTo } = req.body;
  if (!name || !date) return res.status(400).json({ message: 'Missing fields' });

  const sql = `INSERT INTO exams (teacher_id, name, date, time_from, time_to) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [req.user.userId, name, date, timeFrom, timeTo], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ id: this.lastID, name, date, time_from: timeFrom, time_to: timeTo });
  });
});

app.put('/api/exams/:id', authenticateToken, (req, res) => {
  const { name, date, timeFrom, timeTo } = req.body;
  const { id } = req.params;
  if (!name || !date) return res.status(400).json({ message: 'Missing fields' });

  const sql = `UPDATE exams SET name = ?, date = ?, time_from = ?, time_to = ? WHERE id = ? AND teacher_id = ?`;
  db.run(sql, [name, date, timeFrom, timeTo, id, req.user.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Exam not found or unauthorized' });
    res.json({ message: 'Exam updated successfully' });
  });
});

app.delete('/api/exams/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM exams WHERE id = ? AND teacher_id = ?`;
  db.run(sql, [id, req.user.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Exam not found or unauthorized' });
    res.json({ message: 'Exam deleted successfully' });
  });
});

app.get('/api/documents', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM documents WHERE teacher_id = ?`;
  db.all(sql, [req.user.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/documents', authenticateToken, (req, res) => {
  const { name, type, description, content } = req.body;
  if (!name) return res.status(400).json({ message: 'Missing fields' });

  const sql = `INSERT INTO documents (teacher_id, name, type, description, content) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [req.user.userId, name, type, description, content], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ id: this.lastID, name, type, description, content, created_at: new Date() });
  });
});

app.put('/api/documents/:id', authenticateToken, (req, res) => {
  const { name, type, description, content } = req.body;
  const { id } = req.params;
  if (!name) return res.status(400).json({ message: 'Missing fields' });

  const sql = `UPDATE documents SET name = ?, type = ?, description = ?, content = ? WHERE id = ? AND teacher_id = ?`;
  db.run(sql, [name, type, description, content, id, req.user.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Document not found or unauthorized' });
    res.json({ message: 'Document updated successfully' });
  });
});

app.delete('/api/documents/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM documents WHERE id = ? AND teacher_id = ?`;
  db.run(sql, [id, req.user.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Document not found or unauthorized' });
    res.json({ message: 'Document deleted successfully' });
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update current teacher's profile fields
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               phone: { type: string }
 *               subject: { type: string }
 *     responses:
 *       200:
 *         description: Updated profile
 *       403:
 *         description: Not allowed to edit another user's profile
 */
app.patch('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  if (parseInt(id, 10) !== req.user.userId) {
    return res.status(403).json({ message: 'Not allowed to edit another user\'s profile' });
  }

  const { firstname, lastname, phone, subject } = req.body;

  const sql = `UPDATE users SET
    firstname = COALESCE(?, firstname),
    lastname = COALESCE(?, lastname),
    phone = COALESCE(?, phone),
    subject = COALESCE(?, subject)
    WHERE id = ?`;

  db.run(sql, [firstname, lastname, phone, subject, req.user.userId], function (err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ message: 'User not found' });

    db.get(`SELECT id, firstname, lastname, email, phone, subject FROM users WHERE id = ?`, [req.user.userId], (err2, user) => {
      if (err2) return res.status(500).json({ message: 'Database error' });
      res.json(user);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
