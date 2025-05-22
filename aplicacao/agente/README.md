# Agente de IA - Dashboard

Backend simples para análise de JSON do dashboard usando a API OpenAI.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor ficará disponível em http://localhost:3002

## Endpoint

POST `/dashboard-ia`

**Body:**

```json
{
  "dados": {
    /* seu JSON do dashboard aqui */
  }
}
```

**Resposta:**

```json
{
  "resultado": "...resposta da IA..."
}
```
