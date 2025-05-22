// --- JavaScript Base (Sidebar, Modais Genéricos) ---
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    // Força o Leaflet e Charts a recalcular o tamanho após a transição
    setTimeout(() => {
        if (vigilanciaMap) vigilanciaMap.invalidateSize();
        if (tendenciaCasosChartInstance) tendenciaCasosChartInstance.resize();
        if (coberturaVacinalChartInstance) coberturaVacinalChartInstance.resize();
    }, 310); // Deve ser um pouco maior que a transição do CSS
});

function openModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (overlay) overlay.classList.add('active');
}

function closeModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (overlay) overlay.classList.remove('active');
}

document.querySelectorAll('.modal-close-btn, .modal-close-btn-footer').forEach(button => {
    button.addEventListener('click', function () {
        closeModal(this.dataset.modalId);
    });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (event) {
        if (event.target === this) {
            closeModal(this.id);
        }
    });
});

// --- JavaScript Específico da Página de Vigilância Epidemiológica ---
let tendenciaCasosChartInstance, coberturaVacinalChartInstance, vigilanciaMap;

// Dados Simulados para Gráficos e Tabela
const dadosTendenciaDengue = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [{
        label: 'Casos de Dengue',
        data: [65, 59, 80, 81, 95],
        fill: false,
        borderColor: 'var(--danger-color)',
        tension: 0.1
    }]
};

const dadosCoberturaSarampo = {
    labels: ['Região Norte', 'Região Sul', 'Região Leste', 'Região Oeste', 'Região Central'],
    datasets: [{
        label: 'Cobertura Vacinal Sarampo (%)',
        data: [75, 92, 68, 85, 95],
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
        ],
        borderWidth: 1
    }]
};

const dadosNotificacoes = [
    { id: 'NOT001', doenca: 'Dengue', data: '2025-05-20', regiao: 'Leste', status: 'Suspeito', statusClass: 'col-status-warning' },
    { id: 'NOT002', doenca: 'Gripe', data: '2025-05-19', regiao: 'Norte', status: 'Confirmado', statusClass: '' },
    { id: 'NOT003', doenca: 'Dengue', data: '2025-05-18', regiao: 'Leste', status: 'Confirmado', statusClass: '' },
    { id: 'NOT004', doenca: 'Zika', data: '2025-05-17', regiao: 'Norte', status: 'Descartado', statusClass: '' },
    { id: 'NOT005', doenca: 'Dengue', data: '2025-05-15', regiao: 'Centro', status: 'Crítico (Internado)', statusClass: 'col-status-critical' },
];

function inicializarGraficos() {
    const ctxTendencia = document.getElementById('tendenciaCasosChart').getContext('2d');
    tendenciaCasosChartInstance = new Chart(ctxTendencia, {
        type: 'line',
        data: dadosTendenciaDengue,
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });

    const ctxCobertura = document.getElementById('coberturaVacinalChart').getContext('2d');
    coberturaVacinalChartInstance = new Chart(ctxCobertura, {
        type: 'bar',
        data: dadosCoberturaSarampo,
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, indexAxis: 'y' }
    });
}

function inicializarMapaVigilancia() {
    vigilanciaMap = L.map('vigilanciaMapContainer').setView([-25.43, -49.27], 11); // Ex: Curitiba
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors & Gestor Saúde ProAtivo'
    }).addTo(vigilanciaMap);

    // Exemplo de marcadores de incidência (simulado)
    L.circle([-25.44, -49.20], { color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 1500 }).addTo(vigilanciaMap).bindPopup("Região Leste: Alta incidência de Dengue.");
    L.circle([-25.40, -49.25], { color: 'orange', fillColor: '#f80', fillOpacity: 0.5, radius: 1000 }).addTo(vigilanciaMap).bindPopup("Região Norte: Média incidência de Zika.");
    L.circle([-25.50, -49.28], { color: 'green', fillColor: '#0f0', fillOpacity: 0.5, radius: 800 }).addTo(vigilanciaMap).bindPopup("Região Sul: Baixa incidência geral.");
}

function popularTabelaNotificacoes() {
    const tbody = document.getElementById('notificacoesTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpa
    dadosNotificacoes.forEach(notif => {
        const row = tbody.insertRow();
        row.insertCell().textContent = notif.id;
        row.insertCell().textContent = notif.doenca;
        row.insertCell().textContent = new Date(notif.data).toLocaleDateString('pt-BR');
        row.insertCell().textContent = notif.regiao;
        const statusCell = row.insertCell();
        statusCell.textContent = notif.status;
        if (notif.statusClass) statusCell.classList.add(notif.statusClass);

        const acoesCell = row.insertCell();
        const detailButton = document.createElement('button');
        detailButton.innerHTML = '<i class="fas fa-eye"></i> Detalhes';
        detailButton.classList.add('btn', 'btn-info');
        detailButton.style.padding = '5px 8px';
        detailButton.style.fontSize = '0.8em';
        detailButton.onclick = () => {
            document.getElementById('modalNotificacaoId').textContent = notif.id;
            document.getElementById('modalNotificacaoBody').innerHTML = `
                <p><span class="label">Doença:</span> ${notif.doenca}</p>
                <p><span class="label">Data:</span> ${new Date(notif.data).toLocaleDateString('pt-BR')}</p>
                <p><span class="label">Região:</span> ${notif.regiao}</p>
                <p><span class="label">Status Atual:</span> <span class="${notif.statusClass}">${notif.status}</span></p>
                <p><span class="label">Observações:</span> A ser preenchido pelo sistema ou usuário.</p>
            `;
            openModal('notificacaoDetailModal');
        };
        acoesCell.appendChild(detailButton);
    });
}

document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    const doenca = document.getElementById('filterDoenca').value;
    const inicio = document.getElementById('filterPeriodoInicio').value;
    const fim = document.getElementById('filterPeriodoFim').value;
    const regiao = document.getElementById('filterRegiao').value;

    console.log("Filtros Aplicados:", { doenca, inicio, fim, regiao });
    // Aqui viria a lógica para buscar novos dados e atualizar gráficos/tabela/mapa
    // Por ora, apenas um log e talvez re-renderizar com os mesmos dados simulados:
    alert(`Filtros aplicados! (Doença: ${doenca}, Período: ${inicio} a ${fim}, Região: ${regiao}). A atualização dos dados seria implementada aqui.`);

    // Exemplo de como poderia mudar o título do gráfico de tendência:
    const doencaSelecionadaText = document.getElementById('filterDoenca').selectedOptions[0].text;
    if (tendenciaCasosChartInstance && doenca !== "todas") {
        tendenciaCasosChartInstance.data.datasets[0].label = 'Casos de ' + doencaSelecionadaText;
        // Simular novos dados para o gráfico de tendência
        tendenciaCasosChartInstance.data.datasets[0].data = dadosTendenciaDengue.datasets[0].data.map(d => Math.max(0, d + (Math.random() * 20 - 10)));
        tendenciaCasosChartInstance.update();
    } else if (tendenciaCasosChartInstance) {
        tendenciaCasosChartInstance.data.datasets[0].label = 'Total de Casos (Todas Doenças)';
        tendenciaCasosChartInstance.data.datasets[0].data = dadosTendenciaDengue.datasets[0].data.map(d => Math.max(0, d * 1.5 + (Math.random() * 30 - 15))); // Simular dados agregados
        tendenciaCasosChartInstance.update();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    inicializarGraficos();
    inicializarMapaVigilancia();
    popularTabelaNotificacoes();
});
