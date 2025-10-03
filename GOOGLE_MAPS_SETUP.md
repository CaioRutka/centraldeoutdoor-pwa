# Configuração do Google Maps

## Como obter a chave da API do Google Maps

1. **Acesse o Google Cloud Console**
   - Vá para: https://console.cloud.google.com/

2. **Crie um novo projeto ou selecione um existente**

3. **Ative a Google Maps JavaScript API**
   - No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
   - Procure por "Maps JavaScript API"
   - Clique em "Ativar"

4. **Crie credenciais (Chave de API)**
   - Vá em "APIs e Serviços" > "Credenciais"
   - Clique em "Criar credenciais" > "Chave de API"
   - Copie a chave gerada

5. **Configure restrições (Recomendado)**
   - Clique na chave criada para editá-la
   - Em "Restrições de aplicativo", selecione "Sites HTTP"
   - Adicione seus domínios (ex: `localhost:3000`, `seudominio.com`)

6. **Substitua a chave no código**
   - No arquivo `index.html`, substitua `YOUR_API_KEY` pela sua chave real

## Exemplo de uso

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_AQUI&libraries=places"></script>
```

## Custos

- **Gratuito**: Até 28.000 carregamentos de mapa por mês
- **Pago**: $7 por 1.000 carregamentos adicionais

## Segurança

⚠️ **IMPORTANTE**: Nunca commite sua chave de API no repositório público!

Use variáveis de ambiente em produção:
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places"></script>
```
