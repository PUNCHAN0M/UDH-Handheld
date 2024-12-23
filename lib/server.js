const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Use cors
app.use(cors());

// Use express.json() to parse JSON bodies
app.use(express.json());  // This middleware is essential for parsing JSON data

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("login success")
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email === "admin@gmail.com" && password === "12345678"){
    return res.status(200).json({ success: true, message: 'login successs' });
  }

  return res.status(400).json({success: false, message: "email or password incorrect."})
})
// Simulate fetching data from a JSON file
app.get('/api/headheld', (req, res) => {
  console.log('API /prescriptions was accessed');
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }
    const prescriptions = JSON.parse(data);
    res.json(prescriptions);
  });
});

// Handle POST request to update prescriptions
app.post('/api/headheld/:id', (req, res) => {
  const id = req.params.id;  // รับค่า id จาก URL parameter
  console.log('Prescription ID:', id);  // แสดง id ที่รับมา
  console.log('API /updatePrescriptions POST was accessed');
  console.log('Received data:', req.body);  // Now req.body should contain the prescription data

  // You can handle the update logic here, for example, save the data to a file or database

  // Send a success response
  res.status(200).json({ message: 'Prescription updated successfully' });
});

app.get('/api/headheld/stock', (req, res) => {
  console.log('API /prescriptions was accessed');
  fs.readFile(path.join(__dirname, 'stock.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }
    const prescriptions = JSON.parse(data);
    res.json(prescriptions);
  });
});

app.post('/api/stock/:medicinecode', (req, res) => {
  const medicinecode = req.params.medicinecode;  // รับค่า id จาก URL parameter
  console.log('Prescription ID:', medicinecode);  // แสดง id ที่รับมา
  console.log('API /updatePrescriptions POST was accessed');
  console.log('Received data:', req.body);  // Now req.body should contain the prescription data

  // You can handle the update logic here, for example, save the data to a file or database

  // Send a success response
  res.status(200).json({ message: 'Prescription updated successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
