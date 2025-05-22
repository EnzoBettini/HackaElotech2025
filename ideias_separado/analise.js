// Funções para inicializar os gráficos (Chart.js)
let projecaoCasosChartInstance;
let riscoPropagacaoChartInstance;

function inicializarGraficosAnaliseIA() {
    // Dados simulados para Projeção de Casos Futuros
    const dadosProjecao = {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
            label: 'Casos Projetados',
            data: [120, 150, 180, 200], // Valores simulados
            backgroundColor: 'rgba(52, 152, 219, 0.8)', // accent-color
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.3 // Suaviza a linha
        }]
    };

    const ctxProjecao = document.getElementById('projecaoCasosChart').getContext('2d');
    if (projecaoCasosChartInstance) {
        projecaoCasosChartInstance.destroy();
    }
    projecaoCasosChartInstance = new Chart(ctxProjecao, {
        type: 'line',
        data: dadosProjecao,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Casos'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    // Dados simulados para Risco de Propagação por Região (gráfico de barras)
    const dadosRisco = {
        labels: ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste'],
        datasets: [{
            label: 'Nível de Risco (%)',
            data: [45, 70, 60, 85, 30], // Valores simulados
            backgroundColor: [
                'rgba(46, 204, 113, 0.8)', // Success color
                'rgba(230, 126, 34, 0.8)', // Warning color
                'rgba(241, 196, 15, 0.8)', // Warning color
                'rgba(231, 76, 60, 0.8)', // Danger color
                'rgba(52, 152, 219, 0.8)'  // Accent color
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(230, 126, 34, 1)',
                'rgba(241, 196, 15, 1)',
                'rgba(231, 76, 60, 1)',
                'rgba(52, 152, 219, 1)'
            ],
            borderWidth: 1
        }]
    };

    const ctxRisco = document.getElementById('riscoPropagacaoChart').getContext('2d');
    if (riscoPropagacaoChartInstance) {
        riscoPropagacaoChartInstance.destroy();
    }
    riscoPropagacaoChartInstance = new Chart(ctxRisco, {
        type: 'bar',
        data: dadosRisco,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Nível de Risco (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false, // Não precisa de legenda para uma única barra
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
}

// Simulação de Impacto
document.addEventListener('DOMContentLoaded', () => {
    inicializarGraficosAnaliseIA();

    const sliderEscala = document.getElementById('simulacao-impacto-escala');
    const numEscala = document.getElementById('simulacao-impacto-escala-num');
    const runSimulationBtn = document.getElementById('runSimulationBtn');
    const simulationResult = document.getElementById('simulationResult');
    const resultLeitos = document.getElementById('result-leitos');
    const resultProfissionais = document.getElementById('result-profissionais');
    const resultCusto = document.getElementById('result-custo');
    const resultRecomendacao = document.getElementById('result-recomendacao');

    // Sincronizar slider e input numérico
    sliderEscala.addEventListener('input', () => {
        numEscala.value = sliderEscala.value;
    });
    numEscala.addEventListener('input', () => {
        sliderEscala.value = numEscala.value;
    });


    runSimulationBtn.addEventListener('click', () => {
        const tipoDoenca = document.getElementById('simulacao-impacto-doenca').value;
        const escala = parseInt(sliderEscala.value);
        const duracao = parseInt(document.getElementById('simulacao-impacto-duracao').value);

        let leitosNecessarios = 0;
        let profissionaisNecessarios = 0;
        let custoEstimado = 0;
        let recomendacao = "";

        // Lógica de simulação simplificada
        switch (tipoDoenca) {
            case 'dengue':
                leitosNecessarios = Math.ceil(escala * 0.5 * (duracao / 7));
                profissionaisNecessarios = Math.ceil(escala * 0.3 * (duracao / 7));
                custoEstimado = escala * 1500 * (duracao / 7);
                recomendacao = "Aumentar ações de controle do vetor e campanhas de hidratação.";
                break;
            case 'covid':
                leitosNecessarios = Math.ceil(escala * 0.8 * (duracao / 7));
                profissionaisNecessarios = Math.ceil(escala * 0.6 * (duracao / 7));
                custoEstimado = escala * 3000 * (duracao / 7);
                recomendacao = "Avaliar restrições de mobilidade e reforçar testagem.";
                break;
            case 'gripe':
                leitosNecessarios = Math.ceil(escala * 0.3 * (duracao / 7));
                profissionaisNecessarios = Math.ceil(escala * 0.2 * (duracao / 7));
                custoEstimado = escala * 800 * (duracao / 7);
                recomendacao = "Incentivar vacinação e higiene respiratória.";
                break;
            case 'acidente':
                leitosNecessarios = Math.ceil(escala * 1.2); // Escala mais direta para acidentes
                profissionaisNecessarios = Math.ceil(escala * 1);
                custoEstimado = escala * 5000;
                recomendacao = "Ativar plano de emergência, coordenar com serviços de resgate.";
                break;
        }

        resultLeitos.textContent = `Leitos Necessários: ${leitosNecessarios} leitos extras`;
        resultProfissionais.textContent = `Profissionais Necessários: ${profissionaisNecessarios} profissionais extras`;
        resultCusto.textContent = `Custo Estimado: R$ ${custoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        resultRecomendacao.textContent = `Recomendação: ${recomendacao}`;

        simulationResult.style.display = 'block';
    });
});
