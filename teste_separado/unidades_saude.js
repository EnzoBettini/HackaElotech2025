// --- JavaScript Base (Sidebar) ---
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    setTimeout(() => {
        if (window.mapaUnidades && window.mapaUnidades.invalidateSize) window.mapaUnidades.invalidateSize();
    }, 310);
});

// --- Dados simulados de unidades ---
const unidades = [
    { nome: 'UBS Central', regiao: 'Central', especialidades: 'Clínico, Pediatria, Cardiologia', status: 'Normal', lat: -25.43, lng: -49.27 },
    { nome: 'Posto Norte', regiao: 'Norte', especialidades: 'Clínico, Enfermagem', status: 'Alerta', lat: -25.40, lng: -49.25 },
    { nome: 'UBS Sul', regiao: 'Sul', especialidades: 'Clínico, Ginecologia', status: 'Normal', lat: -25.50, lng: -49.28 },
    { nome: 'Posto Rural Alfa', regiao: 'Zona Rural', especialidades: 'Clínico', status: 'Baixo Estoque', lat: -25.35, lng: -49.40 }
];

function popularTabela() {
    const tbody = document.querySelector('#tabelaUnidades tbody');
    tbody.innerHTML = '';
    unidades.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.nome}</td><td>${u.regiao}</td><td>${u.especialidades}</td><td>${u.status}</td>`;
        tbody.appendChild(tr);
    });
}

function inicializarMapa() {
    window.mapaUnidades = L.map('mapaUnidades').setView([-25.43, -49.27], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.mapaUnidades);
    unidades.forEach(u => {
        L.marker([u.lat, u.lng]).addTo(window.mapaUnidades)
            .bindPopup(`<b>${u.nome}</b><br>${u.regiao}<br>${u.especialidades}<br>Status: ${u.status}`);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    popularTabela();
    inicializarMapa();
});
