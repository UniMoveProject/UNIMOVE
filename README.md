# ?? UNIMOVE — Mobilidade Acadêmica & Carona Solidária

> *A rota até a faculdade, dividida com quem já faz o mesmo caminho.*

Aplicação Single Page Application (SPA) desenvolvida em **Vite + Vanilla JS**, integrando todas as funcionalidades da plataforma UniMove sob uma arquitetura limpa, modular e em conformidade estrita com o **Manual de Identidade Visual v1 (2026)**.

---

## ?? Identidade Visual (Manual de Marca)

- **Fundo Padrão (Modo Claro)**: Branco-bege `#FFF4CC` (RGB 255, 244, 204) — acolhedor e leve.
- **Modo Escuro (Opcional)**: Preto UniMove `#131313` (RGB 19, 19, 19).
- **Ação & Segurança**: Azul UniMove `#0F5DED` (RGB 15, 93, 237).
- **Energia & Destaque**: Amarelo UniMove `#F8D410` (RGB 248, 212, 16).
- **Economia & Confirmações**: Verde-claro UniMove `#86FA01` (RGB 134, 250, 1).

### Tipografia Oficial
1. **Títulos**: `Faster One` (caixa alta com tracking característico da marca).
2. **Subtítulos, Rótulos e Botões**: `Madimi One` (amigável e jovial).
3. **Textos, Mensagens e Formulários**: `Patrick Hand SC` (acolhedor e humanizado).

---

## ?? Estrutura do Projeto

```
UniMoveVite/
+-- index.html                   # Ponto de entrada HTML único da SPA
+-- package.json                 # Scripts do Vite e dependências
+-- vite.config.js               # Configuração do Vite
+-- public/                      # Arquivos estáticos e logos
¦   +-- faricon.png
¦   +-- logo.png
+-- src/
    +-- styles/
    ¦   +-- main.css             # Estilos consolidados (tokens, temas e componentes)
    +-- services/                # Lógica e backend desacoplado por função
    ¦   +-- theme.js             # Alternador de modo Claro/Escuro
    ¦   +-- auth.js              # Login, registro e sessão universitária
    ¦   +-- rides.js             # Feed, busca com filtros, pedidos e CRUD de caronas
    ¦   +-- chat.js              # Troca de mensagens no grupo da carona
    ¦   +-- storage.js           # Gerenciamento de estado (localStorage)
    ¦   +-- supabaseClient.js    # Conector preparado para futura integração com Supabase
    +-- components/              # Componentes reutilizáveis
    ¦   +-- Header.js            # Topbar com logo em escudo, rotas e alternador de tema
    ¦   +-- Footer.js            # Rodapé acadêmico institucional
    ¦   +-- RideCard.js          # Card padronizado de exibição de carona
    ¦   +-- Modal.js             # Janelas modais para confirmações e mini-perfis
    +-- views/                   # Telas da aplicação
    ¦   +-- LandingView.js        # Landing page com estatísticas e 5 sentimentos da marca
    ¦   +-- HomeView.js           # Feed do dia e rota em destaque
    ¦   +-- SearchRidesView.js   # Filtro e listagem interativa de caronas
    ¦   +-- OfferRideView.js     # Formulário de publicação de rotas
    ¦   +-- MyRidesView.js       # Painel das caronas do usuário
    ¦   +-- EditRideView.js      # Edição de informações da carona
    ¦   +-- ChatView.js          # Chat interativo do grupo da carona
    ¦   +-- ProfileView.js       # Perfil do estudante e preferências de mobilidade
    ¦   +-- LoginView.js         # Tela de login
    ¦   +-- RegisterView.js      # Tela de cadastro com upload de foto e validações
    +-- router.js                # Roteador SPA client-side reativo
    +-- main.js                  # Inicializador da aplicação
```

---

## ?? Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar em desenvolvimento
```bash
npm run dev
```

### 3. Gerar build de produção (Vercel)
```bash
npm run build
```

---

## ? Integração Futura com Supabase

O arquivo `src/services/supabaseClient.js` e a camada de serviços em `src/services/` já foram desenhados para trocar facilmente os métodos de armazenamento local pelas consultas assíncronas do Supabase.
