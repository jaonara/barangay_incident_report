const express = require('express');
const app = express();

app.use(express.json());

// Temp"database"
let incidents = [];
let id = 1;

// GET all
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

// GET by ID
app.get('/api/incidents/:id', (req, res) => {
  const incident = incidents.find((i) => i.id == req.params.id);
  if (!incident) return res.status(404).json({ message: 'Not found' });
  res.json(incident);
});

// CREATE
app.post('/api/incidents', (req, res) => {
  const newIncident = {
    id: id++,
    reporter_name: req.body.reporter_name,
    contact_number: req.body.contact_number,
    location: req.body.location,
    incident_type: req.body.incident_type,
    description: req.body.description,
    status: 'pending',
    date_reported: new Date(),
  };

  incidents.push(newIncident);
  res.status(201).json(newIncident);
});

// UPDATE
app.put('/api/incidents/:id', (req, res) => {
  const incident = incidents.find((i) => i.id == req.params.id);
  if (!incident) return res.status(404).json({ message: 'Not found' });

  Object.assign(incident, req.body);
  res.json(incident);
});

// DELETE
app.delete('/api/incidents/:id', (req, res) => {
  incidents = incidents.filter((i) => i.id != req.params.id);
  res.json({ message: 'Deleted successfully' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
