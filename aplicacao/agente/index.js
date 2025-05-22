import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = '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';
const OPENAI_MODEL = 'gpt-4o-mini';

// Endpoint para análise do dashboard
app.post('/dashboard-ia', async (req, res) => {
    const { dados } = req.body; // Espera um JSON com a chave 'dados'
    if (!dados) {
        return res.status(400).json({ error: 'Envie o JSON na chave "dados".' });
    }

    // Prompt para a IA: peça para identificar e descrever os dados do dashboard
    const prompt = `Você é um agente de dados para dashboards. Analise o JSON fornecido e descreva, de forma clara e organizada, quais informações ele contém e para que servem no contexto de um dashboard de saúde pública. Liste as principais chaves, explique o que cada uma representa e sugira onde cada informação pode ser exibida no dashboard (ex: KPIs, cards, mapas, painéis, alertas, campanhas, etc).\n\nJSON:\n${JSON.stringify(dados, null, 2)}\n\nResponda em formato de tópicos, com exemplos de uso para cada campo.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: OPENAI_MODEL,
                messages: [
                    { role: 'user', content: prompt }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
        const result = response.data.choices?.[0]?.message?.content || 'Sem resposta.';
        res.json({ resultado: result });
    } catch (error) {
        if (error.response && error.response.status === 429) {
            return res.json({
                resultado: 'FAKE: O JSON contém as chaves principais do dashboard, como KPIs, áreas, campanhas e alertas. Cada uma pode ser usada para preencher os respectivos cards, mapas e painéis do dashboard.'
            });
        }
        res.status(500).json({ error: 'Erro ao consultar a API OpenAI', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('<h2>Agente de IA do Dashboard rodando!<br>Use o endpoint <code>/dashboard-ia</code> via POST para análise de JSON.</h2>');
});

app.listen(3002, () => {
    console.log('Agente de IA do Dashboard rodando em http://localhost:3002');
});
