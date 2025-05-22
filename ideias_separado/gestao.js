// ... (todo o JS extraído de <script> em gestao.html) ...

// --- JavaScript Base (Sidebar, Modais Genéricos) ---
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    setTimeout(() => {
        if (recursosMap) recursosMap.invalidateSize();
        if (distribuicaoChartInstance) distribuicaoChartInstance.resize();
        if (demandaCapacidadeChartInstance) demandaCapacidadeChartInstance.resize();
    }, 310);
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

// --- JavaScript Específico da Página de Gestão de Recursos ---
let distribuicaoChartInstance, demandaCapacidadeChartInstance, recursosMap;

// Dados Simulados
defineData();

function defineData() {
    window.dadosDistribuicaoProfissionais = {
        labels: ['Médicos', 'Enfermeiros', 'Técnicos Enf.', 'Agentes Saúde', 'Outros'],
        datasets: [{
            label: 'Distribuição',
            data: [120, 150, 180, 25, 10],
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(201, 203, 207, 0.7)'
            ],
            hoverOffset: 4
        }]
    };

    window.dadosDemandaCapacidadeCardio = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
            label: 'Demanda (Consultas Solicitadas)',
            data: [200, 220, 250, 230, 280],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
        }, {
            label: 'Capacidade (Consultas Ofertadas)',
            data: [180, 180, 170, 190, 175],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }]
    };

    window.dadosProfissionais = [
        { id: 'P001', nome: 'Dr. Carlos Silva', especialidade: 'Cardiologia', unidade: 'Hospital Municipal', cargaHoraria: '40h', status: 'Sobrecarga', statusClass: 'status-sobrecarga', avatarIcon: 'fa-user-doctor' },
        { id: 'P002', nome: 'Enf. Ana Souza', especialidade: 'Enfermagem Geral', unidade: 'UBS Centro', cargaHoraria: '36h', status: 'OK', statusClass: 'status-ok', avatarIcon: 'fa-user-nurse' },
        { id: 'P003', nome: 'Dr. João Pereira', especialidade: 'Pediatria', unidade: 'UBS Norte', cargaHoraria: '20h (Parcial)', status: 'Alerta Baixa Cobertura', statusClass: 'status-alerta', avatarIcon: 'fa-user-doctor' },
        { id: 'P004', nome: 'Téc. Maria Oliveira', especialidade: 'Técnico Enfermagem', unidade: 'Hospital Municipal', cargaHoraria: '40h', status: 'OK', statusClass: 'status-ok', avatarIcon: 'fa-user-nurse' },
        { id: 'P005', nome: 'Dr. Ricardo Lima', especialidade: 'Clínica Geral', unidade: 'UBS Sul (Remoto)', cargaHoraria: '30h', status: 'Subutilizado', statusClass: 'status-subutilizado', avatarIcon: 'fa-user-doctor' },
    ];

    window.sugestoesIA = [
        "Remanejar Dr. Ricardo Lima (Clínica Geral, UBS Sul) para UBS Leste (alta demanda) por 2 dias/semana.",
        "Abrir processo seletivo para 2 Cardiologistas para o Hospital Municipal devido à fila de espera > 30 dias.",
        "Oferecer treinamento em triagem avançada para Técnicos de Enfermagem da UBS Centro para otimizar fluxo.",
        "Considerar teleconsultas para acompanhamento de pacientes crônicos estáveis em Ginecologia na UBS Norte.",
    ];

    window.unidadesSaudeRH = [
        { nome: "Hospital Municipal", coords: [-25.4285, -49.2731], staffing: 'critical', equipe: ['Dr. Carlos (Cardio)', 'Dr. Mendes (Orto)', '15 Enfermeiros'] },
        { nome: "UBS Centro", coords: [-25.4320, -49.2650], staffing: 'ok', equipe: ['Enf. Ana (Geral)', 'Dr. Alves (Clínico)', '5 Técnicos'] },
        { nome: "UBS Norte", coords: [-25.4000, -49.2500], staffing: 'warning', equipe: ['Dr. João (Pediatra)', '2 Enfermeiros'] },
        { nome: "UBS Sul", coords: [-25.4850, -49.2800], staffing: 'info', equipe: ['Dr. Ricardo (Clínico - Remoto)', '1 Enfermeiro'] }
    ];
}

function inicializarGraficosRH() {
    const ctxDistribuicao = document.getElementById('distribuicaoProfissionaisChart').getContext('2d');
    distribuicaoChartInstance = new Chart(ctxDistribuicao, {
        type: 'doughnut',
        data: window.dadosDistribuicaoProfissionais,
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    const ctxDemanda = document.getElementById('demandaCapacidadeChart').getContext('2d');
    demandaCapacidadeChartInstance = new Chart(ctxDemanda, {
        type: 'bar',
        data: window.dadosDemandaCapacidadeCardio,
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
}

function inicializarMapaRecursos() {
    recursosMap = L.map('recursosMapContainer').setView([-25.43, -49.27], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors & Gestor Saúde ProAtivo'
    }).addTo(recursosMap);

    window.unidadesSaudeRH.forEach(unidade => {
        let iconColor = 'green'; // ok
        if (unidade.staffing === 'critical') iconColor = 'red';
        else if (unidade.staffing === 'warning') iconColor = 'orange';
        else if (unidade.staffing === 'info') iconColor = 'blue'; // subutilizado

        const marker = L.marker(unidade.coords, {
            icon: L.divIcon({
                className: 'custom-leaflet-icon-rh',
                html: `<div style="background-color:${iconColor}; width:20px; height:20px; border-radius:50%; display:flex; justify-content:center; align-items:center; border: 2px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.5);"><i class="fas fa-hospital" style="color:white; font-size:10px;"></i></div>`,
                iconSize: [20, 20]
            })
        }).addTo(recursosMap);

        marker.bindPopup(`<b>${unidade.nome}</b><br>Status Equipe: ${unidade.staffing.toUpperCase()}<br>Equipe Principal: ${unidade.equipe.slice(0, 2).join(', ')}...`);
    });
}

function popularTabelaProfissionais() {
    const tbody = document.getElementById('profissionaisTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    window.dadosProfissionais.forEach(prof => {
        const row = tbody.insertRow();
        row.insertCell().textContent = prof.nome;
        row.insertCell().textContent = prof.especialidade;
        row.insertCell().textContent = prof.unidade;
        row.insertCell().textContent = prof.cargaHoraria;

        const statusCell = row.insertCell();
        const statusDot = document.createElement('span');
        statusDot.classList.add('status-dot', prof.statusClass);
        statusCell.appendChild(statusDot);
        statusCell.appendChild(document.createTextNode(prof.status));

        const acoesCell = row.insertCell();
        acoesCell.classList.add('action-buttons');
        const detailButton = document.createElement('button');
        detailButton.innerHTML = '<i class="fas fa-eye"></i>';
        detailButton.title = "Ver Detalhes";
        detailButton.classList.add('btn', 'btn-info');
        detailButton.onclick = () => exibirDetalhesProfissional(prof);
        acoesCell.appendChild(detailButton);

        const remanejarButton = document.createElement('button');
        remanejarButton.innerHTML = '<i class="fas fa-exchange-alt"></i>';
        remanejarButton.title = "Sugerir Remanejamento";
        remanejarButton.classList.add('btn', 'btn-accent');
        // remanejarButton.onclick = () => abrirModalRemanejamento(prof.id); // Futura implementação
        acoesCell.appendChild(remanejarButton);
    });
}

function exibirDetalhesProfissional(prof) {
    const modalBody = document.getElementById('modalProfissionalBody');
    modalBody.innerHTML = `
        <div class="profile-grid">
            <div>
                <div class="profile-avatar"><i class="fas ${prof.avatarIcon || 'fa-user-md'}"></i></div>
                <h4>${prof.nome}</h4>
                <p><span class="label">ID:</span> ${prof.id}</p>
            </div>
            <div>
                <p><span class="label">Especialidade:</span> ${prof.especialidade}</p>
                <p><span class="label">Unidade Atual:</span> ${prof.unidade}</p>
                <p><span class="label">Carga Horária Contratada:</span> ${prof.cargaHoraria}</p>
                <p><span class="label">Status Atual:</span> <span class="${prof.statusClass}" style="padding:3px 6px; border-radius:4px; color: ${prof.statusClass === 'status-ok' || prof.statusClass === 'status-subutilizado' ? 'white' : 'black'}; background-color: var(--${prof.statusClass.split('-')[1]}-color, var(--secondary-color))">${prof.status}</span></p>
                <p><span class="label">Telefone:</span> (XX) XXXXX-XXXX (Simulado)</p>
                <p><span class="label">Email:</span> ${prof.nome.toLowerCase().replace('dr. ', '').replace('enf. ', '').replace('téc. ', '').replace(' ', '.')}@saude.gov.br (Simulado)</p>
                <p><span class="label">Tempo de Serviço:</span> ${Math.floor(Math.random() * 10 + 2)} anos (Simulado)</p>
                <p><span class="label">Última Avaliação de Desempenho:</span> ${(Math.random() * 2 + 3).toFixed(1)}/5.0 (Simulado)</p>
            </div>
        </div>
        <hr style="margin: 15px 0;">
        <h5>Histórico de Alocação (Simulado):</h5>
        <ul>
            <li>01/2024 - Presente: ${prof.unidade}</li>
            <li>06/2023 - 12/2023: UBS Rural Leste</li>
        </ul>
        <h5>Sugestões da IA para este profissional:</h5>
        <p>${prof.status === 'Sobrecarga' ? 'Considerar redução de agenda ou apoio de outro profissional.' : (prof.status === 'Subutilizado' ? 'Avaliar remanejamento para unidade com maior demanda ou ampliação de escopo.' : 'Manter monitoramento.')}</p>
    `;
    openModal('profissionalDetailModal');
}

function popularSugestoesIA() {
    const listElement = document.getElementById('sugestoesIaList');
    listElement.innerHTML = '';
    window.sugestoesIA.forEach(sug => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<i class="fas fa-lightbulb"></i> ${sug}`;
        listElement.appendChild(listItem);
    });
}

document.getElementById('applyRHFiltersBtn').addEventListener('click', () => {
    const tipo = document.getElementById('filterTipoProfissional').value;
    const esp = document.getElementById('filterEspecialidade').value;
    const unidade = document.getElementById('filterUnidade').value;
    alert(`Filtros de RH aplicados! (Tipo: ${tipo}, Especialidade: ${esp}, Unidade: ${unidade}). A atualização dos dados seria implementada aqui.`);
    // Simular atualização da tabela (poderia filtrar 'dadosProfissionais' e repopular)
    popularTabelaProfissionais(); // Repopula com os mesmos dados por enquanto
});

document.addEventListener('DOMContentLoaded', () => {
    inicializarGraficosRH();
    inicializarMapaRecursos();
    popularTabelaProfissionais();
    popularSugestoesIA();

    // KPIs simulados (poderiam ser calculados a partir dos dados)
    document.getElementById('kpiTotalProfissionais').textContent = window.dadosProfissionais.length * 10 + Math.floor(Math.random() * 50); // Apenas para variar
    document.getElementById('kpiSobrecarga').textContent = window.dadosProfissionais.filter(p => p.status === 'Sobrecarga').length * 5 + Math.floor(Math.random() * 5);
    document.getElementById('kpiSubutilizados').textContent = window.dadosProfissionais.filter(p => p.status === 'Subutilizado').length * 3 + Math.floor(Math.random() * 3);
});
