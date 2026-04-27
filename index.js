const express = require('express');
const app = express();

app.use(express.json());

// Temporary database
let incidents = [];
let id = 1;

/* =========================
   GET ALL INCIDENTS
========================= */
app.get('/', (req, res) => {
  res.send('Welcome to the Barangay Incident Report API!');
});

/* =========================
   GET INCIDENT BY ID
========================= */
app.get('/api/incidents/:id', (req, res) => {
  const incident = incidents.find((i) => i.id == req.params.id);

  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  res.json(incident);
});

/* =========================
   CREATE INCIDENT
========================= */
app.post('/api/incidents', (req, res) => {
  const { reporter_name, contact_number, location, incident_type, description } = req.body;

  // Validation
  if (!reporter_name || !contact_number || !location || !incident_type || !description) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  const newIncident = {
    id: id++,
    reporter_name,
    contact_number,
    location,
    incident_type,
    description,
    status: 'pending',
    date_reported: new Date().toISOString(),
  };

  incidents.push(newIncident);

  res.status(201).json(newIncident);
});

/* =========================
   UPDATE INCIDENT
========================= */
app.put('/api/incidents/:id', (req, res) => {
  const incident = incidents.find((i) => i.id == req.params.id);

  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  const { status, description, location } = req.body;

  // Only allow safe updates
  if (status) incident.status = status;
  if (description) incident.description = description;
  if (location) incident.location = location;

  res.json({
    message: 'Incident updated successfully',
    updated: incident,
  });
});

/* =========================
   DELETE INCIDENT
========================= */
app.delete('/api/incidents/:id', (req, res) => {
  const initialLength = incidents.length;

  incidents = incidents.filter((i) => i.id != req.params.id);

  if (incidents.length === initialLength) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  res.json({ message: 'Deleted successfully' });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});