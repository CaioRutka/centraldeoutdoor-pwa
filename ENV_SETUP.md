# Configuração de Variáveis de Ambiente

## Como configurar as variáveis de ambiente

### 1. Copie o arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Configure suas variáveis no arquivo `.env`

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

### 3. Obtenha uma chave da Google Maps API

1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou selecione um existente
3. Ative a "Maps JavaScript API"
4. Crie credenciais (Chave de API)
5. Configure restrições de domínio (recomendado)

### 4. Adicione a chave no arquivo `.env`

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDAxC11ZF8BH_ji-7f7UwElGu2Hb4HwzWM
```

## Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite o arquivo `.env` no repositório
- O arquivo `.env` já está no `.gitignore`
- Use `.env.example` como template para outros desenvolvedores

## Variáveis disponíveis

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_GOOGLE_MAPS_API_KEY` | Chave da API do Google Maps | Sim |

## Como funciona

1. **Desenvolvimento**: As variáveis são carregadas automaticamente pelo Vite
2. **Produção**: Configure as variáveis no seu provedor de hospedagem
3. **Carregamento dinâmico**: A API do Google Maps é carregada apenas quando necessário

## Exemplo de uso

```typescript
// A variável é acessada automaticamente
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```
