# ?? UNIMOVE � Mobilidade Acad�mica & Carona Solid�ria

> *A rota at� a faculdade, dividida com quem j� faz o mesmo caminho.*

Aplica��o Single Page Application (SPA) desenvolvida em **Vite + Vanilla JS**, integrando todas as funcionalidades da plataforma UniMove sob uma arquitetura limpa, modular e em conformidade estrita com o **Manual de Identidade Visual v1 (2026)**.

---

## ?? Identidade Visual (Manual de Marca)

- **Fundo Padr�o (Modo Claro)**: Branco-bege `#FFF4CC` (RGB 255, 244, 204) � acolhedor e leve.
- **Modo Escuro (Opcional)**: Preto UniMove `#131313` (RGB 19, 19, 19).
- **A��o & Seguran�a**: Azul UniMove `#0F5DED` (RGB 15, 93, 237).
- **Energia & Destaque**: Amarelo UniMove `#F8D410` (RGB 248, 212, 16).
- **Economia & Confirma��es**: Verde-claro UniMove `#86FA01` (RGB 134, 250, 1).

### Tipografia Oficial
1. **T�tulos**: `Faster One` (caixa alta com tracking caracter�stico da marca).
2. **Subt�tulos, R�tulos e Bot�es**: `Madimi One` (amig�vel e jovial).
3. **Textos, Mensagens e Formul�rios**: `Patrick Hand SC` (acolhedor e humanizado).

---

## ?? Estrutura do Projeto

```
UniMoveVite/
+-- index.html                   # Ponto de entrada HTML �nico da SPA
+-- package.json                 # Scripts do Vite e depend�ncias
+-- vite.config.js               # Configura��o do Vite
+-- public/                      # Arquivos est�ticos e logos
�   +-- faricon.png
�   +-- logo.png
+-- src/
    +-- styles/
    �   +-- main.css             # Estilos consolidados (tokens, temas e componentes)
    +-- services/                # L�gica e backend desacoplado por fun��o
    �   +-- theme.js             # Alternador de modo Claro/Escuro
    �   +-- auth.js              # Login, registro e sess�o universit�ria
    �   +-- rides.js             # Feed, busca com filtros, pedidos e CRUD de caronas
    �   +-- chat.js              # Troca de mensagens no grupo da carona
    �   +-- storage.js           # Gerenciamento de estado (localStorage)
    �   +-- supabaseClient.js    # Conector preparado para futura integra��o com Supabase
    +-- components/              # Componentes reutiliz�veis
    �   +-- Header.js            # Topbar com logo em escudo, rotas e alternador de tema
    �   +-- Footer.js            # Rodap� acad�mico institucional
    �   +-- RideCard.js          # Card padronizado de exibi��o de carona
    �   +-- Modal.js             # Janelas modais para confirma��es e mini-perfis
    +-- views/                   # Telas da aplica��o
    �   +-- LandingView.js        # Landing page com estat�sticas e 5 sentimentos da marca
    �   +-- HomeView.js           # Feed do dia e rota em destaque
    �   +-- SearchRidesView.js   # Filtro e listagem interativa de caronas
    �   +-- OfferRideView.js     # Formul�rio de publica��o de rotas
    �   +-- MyRidesView.js       # Painel das caronas do usu�rio
    �   +-- EditRideView.js      # Edi��o de informa��es da carona
    �   +-- ChatView.js          # Chat interativo do grupo da carona
    �   +-- ProfileView.js       # Perfil do estudante e prefer�ncias de mobilidade
    �   +-- LoginView.js         # Tela de login
    �   +-- RegisterView.js      # Tela de cadastro com upload de foto e valida��es
    +-- router.js                # Roteador SPA client-side reativo
    +-- main.js                  # Inicializador da aplica��o
```

---

## ?? Como Executar

### 1. Instalar depend�ncias
```bash
npm install
```

### 2. Rodar em desenvolvimento
```bash
npm run dev
```

### 3. Gerar build de produ��o (Vercel)
```bash
npm run build
```

---

## ? Integra��o Futura com Supabase

O arquivo `src/services/supabaseClient.js` e a camada de servi�os em `src/services/` j� foram desenhados para trocar facilmente os m�todos de armazenamento local pelas consultas ass�ncronas do Supabase.
