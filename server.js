const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Datos en memoria (sin base de datos)
let jobs = [
  {
    id: 1,
    title: "Desarrollador Frontend React",
    company: "TechCorp",
    description: "Buscamos desarrollador React con experiencia en TypeScript. Trabajo 100% remoto.",
    salary: "$3000-$5000",
    location: "Remoto",
    type: "Full-time",
    posted: "2024-01-15"
  },
  {
    id: 2,
    title: "Desarrollador Backend Node.js",
    company: "StartupXYZ",
    description: "Desarrollador Node.js con experiencia en Express y APIs REST. Horario flexible.",
    salary: "$3500-$6000",
    location: "Remoto",
    type: "Full-time",
    posted: "2024-01-14"
  },
  {
    id: 3,
    title: "Diseñador UI/UX",
    company: "DesignStudio",
    description: "Diseñador UI/UX con experiencia en Figma y diseño de interfaces web.",
    salary: "$2500-$4000",
    location: "Remoto",
    type: "Part-time",
    posted: "2024-01-13"
  }
];

let applications = [];

// API Routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: 'Trabajo no encontrado' });
  }
  res.json(job);
});

app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: jobs.length + 1,
    ...req.body,
    posted: new Date().toISOString().split('T')[0]
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.post('/api/apply', (req, res) => {
  const { jobId, name, email, resume } = req.body;
  
  const application = {
    id: applications.length + 1,
    jobId,
    name,
    email,
    resume,
    appliedAt: new Date().toISOString()
  };
  
  applications.push(application);
  res.status(201).json({ message: 'Aplicación enviada exitosamente', application });
});

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
