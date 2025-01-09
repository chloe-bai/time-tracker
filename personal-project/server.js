const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// data routing
const usersFilePath = path.join(__dirname, 'users.json');
const logsFilePath = path.join(__dirname, 'logs.json');

// middleware
app.use(cors());
app.use(bodyParser.json());

// user stuff
const loadUsers = () => {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

let users = loadUsers();

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPassword };
        users.push(newUser);

        saveUsers(users);

        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = users.find((user) => user.username === username);
    if (!user) {
        return res.status(400).json({ error: 'User not found.' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/api/users', (req, res) => {
    const safeUsers = users.map((user) => ({
        username: user.username,
    }));
    res.json(safeUsers);
});

const loadLogs = () => {
  if (fs.existsSync(logsFilePath)) {
      const data = fs.readFileSync(logsFilePath, 'utf8');
      return JSON.parse(data);
  }
  return [];
};

//log stuff
const saveLogs = (logs) => {
  fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
};

let logs = loadLogs();

app.post('/api/logs', (req, res) => {
  const { user, sport, event, time, date } = req.body;

  if (!user || !sport || !event || !time || !date) {
      return res.status(400).json({ error: 'All fields are required.' });
  }

  const newLog = { user, sport, event, time, date };
  logs.push(newLog);

  saveLogs(logs);

  res.status(201).json({ message: 'Log added successfully!' });
});

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
