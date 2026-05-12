// Estado de la aplicación
let currentView = 'home';
let jobs = [];
let selectedJob = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
    render();
});

// Fetch trabajos desde API
async function fetchJobs() {
    try {
        const response = await fetch('/api/jobs');
        jobs = await response.json();
        render();
    } catch (error) {
        console.error('Error al cargar trabajos:', error);
    }
}

// Cambiar vista
function setView(view) {
    currentView = view;
    selectedJob = null;
    render();
}

// Manejar aplicar a trabajo
function handleApply(jobId) {
    selectedJob = jobs.find(j => j.id === jobId);
    currentView = 'apply';
    render();
}

// Manejar post job
function handlePostJob() {
    currentView = 'post-job';
    render();
}

// Renderizar aplicación
function render() {
    const app = document.getElementById('app');
    
    let html = `
        <div class="container">
            <header>
                <h1>🚀 Remote Jobs</h1>
                <p>Encuentra el trabajo remoto de tus sueños</p>
                <nav>
                    <button class="${currentView === 'home' ? 'active' : ''}" onclick="setView('home')">
                        Ver Trabajos
                    </button>
                    <button class="${currentView === 'post-job' ? 'active' : ''}" onclick="handlePostJob()">
                        Publicar Trabajo
                    </button>
                </nav>
            </header>
    `;

    if (currentView === 'home') {
        html += renderJobList();
    } else if (currentView === 'apply' && selectedJob) {
        html += renderApplicationForm();
    } else if (currentView === 'post-job') {
        html += renderPostJobForm();
    }

    html += '</div>';
    app.innerHTML = html;
}

// Renderizar lista de trabajos
function renderJobList() {
    if (jobs.length === 0) {
        return '<div class="loading">Cargando trabajos...</div>';
    }

    let html = '<div class="jobs-grid">';
    jobs.forEach(job => {
        html += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <div class="company">${job.company}</div>
                <p class="description">${job.description}</p>
                <div class="details">
                    <span class="detail">📍 ${job.location}</span>
                    <span class="detail">💼 ${job.type}</span>
                    <span class="detail">📅 ${job.posted}</span>
                </div>
                <div class="salary">💰 ${job.salary}</div>
                <button onclick="handleApply(${job.id})">Aplicar Ahora</button>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Renderizar formulario de aplicación
function renderApplicationForm() {
    return `
        <div class="form-container">
            <button class="back-button" onclick="setView('home')">← Volver</button>
            <h2>Aplicar para: ${selectedJob.title}</h2>
            <p style="margin-bottom: 20px; color: #666;">${selectedJob.company}</p>
            
            <form onsubmit="submitApplication(event)">
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" name="name" required />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required />
                </div>

                <div class="form-group">
                    <label>Resumen / CV (Texto)</label>
                    <textarea name="resume" required placeholder="Describe tu experiencia y habilidades..."></textarea>
                </div>

                <button type="submit">Enviar Aplicación</button>
            </form>
        </div>
    `;
}

// Renderizar formulario de post job
function renderPostJobForm() {
    return `
        <div class="form-container">
            <button class="back-button" onclick="setView('home')">← Volver</button>
            <h2>Publicar Nuevo Trabajo</h2>
            
            <form onsubmit="submitJob(event)">
                <div class="form-group">
                    <label>Título del Puesto</label>
                    <input type="text" name="title" required placeholder="Ej: Desarrollador Frontend React" />
                </div>

                <div class="form-group">
                    <label>Empresa</label>
                    <input type="text" name="company" required placeholder="Ej: TechCorp" />
                </div>

                <div class="form-group">
                    <label>Descripción</label>
                    <textarea name="description" required placeholder="Describe el puesto y requisitos..."></textarea>
                </div>

                <div class="form-group">
                    <label>Salario</label>
                    <input type="text" name="salary" required placeholder="Ej: $3000-$5000" />
                </div>

                <div class="form-group">
                    <label>Ubicación</label>
                    <select name="location">
                        <option value="Remoto">Remoto</option>
                        <option value="Híbrido">Híbrido</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Tipo de Empleo</label>
                    <select name="type">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>

                <button type="submit">Publicar Trabajo</button>
            </form>
        </div>
    `;
}

// Enviar aplicación
async function submitApplication(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        jobId: selectedJob.id,
        name: formData.get('name'),
        email: formData.get('email'),
        resume: formData.get('resume')
    };

    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('¡Aplicación enviada exitosamente!');
            setView('home');
        } else {
            alert('Error al enviar aplicación');
        }
    } catch (error) {
        alert('Error al enviar aplicación');
    }
}

// Enviar nuevo trabajo
async function submitJob(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        company: formData.get('company'),
        description: formData.get('description'),
        salary: formData.get('salary'),
        location: formData.get('location'),
        type: formData.get('type')
    };

    try {
        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const newJob = await response.json();
            jobs.push(newJob);
            alert('¡Trabajo publicado exitosamente!');
            setView('home');
        } else {
            alert('Error al publicar trabajo');
        }
    } catch (error) {
        alert('Error al publicar trabajo');
    }
}
