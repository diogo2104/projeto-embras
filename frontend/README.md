# Frontend - Gerenciamento de Publicidade

Frontend em Angular + PrimeNG para consumir o backend Rails do desafio técnico.

## Stack
- Angular 21
- PrimeNG 21
- Reactive Forms
- HttpClient com interceptor de erro
- Docker + Nginx para produção

## Funcionalidades implementadas
- Listagem de publicidades com imagem, estados e status
- Filtros por título, estado e vigência
- Cadastro e edição de publicidade
- Upload de imagem com pré-visualização
- Encerramento e exclusão de publicidade
- CRUD simples de estados
- Toasts de sucesso/erro
- MultiSelect de estados com PrimeNG

## Como rodar localmente

```bash
cd frontend
npm install
npm start
```

O frontend sobe em `http://localhost:4200` e usa proxy para `http://localhost:3000`.

## Como conectar com o backend Rails
O backend atual expõe:
- `GET /publicidades`
- `GET /publicidades/:id`
- `POST /publicidades`
- `PUT /publicidades/:id`
- `PATCH /publicidades/:id/encerrar`
- `DELETE /publicidades/:id`
- `GET /estados`
- `POST /estados`
- `PUT /estados/:id`
- `DELETE /estados/:id`

No desenvolvimento, o Angular usa `proxy.conf.json` para encaminhar `/api/*` ao backend Rails.

## Ajustes recomendados no backend
Para o frontend carregar imagens do Active Storage sem erro de CORS/origem, vale expor o backend em `http://localhost:3000` e, se necessário, habilitar CORS para o frontend.

Uma opção comum em Rails API é instalar e configurar `rack-cors`.
