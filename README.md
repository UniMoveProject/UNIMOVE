# UniMove

> **Mobilidade Acadêmica & Carona Solidária**  
> A rota até a faculdade, dividida com quem faz o mesmo caminho.

---

## 📋 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Recursos Principais](#-recursos-principais)
3. [Integrantes e Papéis](#-integrantes-e-papéis)
4. [Especificações de Perfil e Regras de Negócio](#-especificações-de-perfil-e-regras-de-negócio)
5. [Sistema de Incentivos e Recompensas](#-sistema-de-incentivos-e-recompensas)
6. [Guia de Estilo & Identidade Visual (Branding)](#-guia-de-estilo--identidade-visual-branding)
7. [Diretrizes de Responsividade & UI/UX](#-diretrizes-de-responsividade--uiux)
8. [Instalação e Execução Local](#-instalação-e-execução-local)
9. [Cronograma e Entregáveis](#-cronograma-e-entregáveis)

---

## 🚗 Sobre o Projeto

O **UniMove** é uma plataforma de mobilidade colaborativa idealizada e desenvolvida por estudantes para a comunidade acadêmica do **UNICEPLAC**. O objetivo principal é aproximar alunos que compartilham o mesmo trajeto diário, otimizando vagas ociosas em veículos particulares, reduzindo os custos individuais de deslocamento e aumentando a segurança nas viagens por meio da validação e verificação entre pares da própria instituição.

### Os 5 Pilares do UniMove
* 🛡️ **Segurança:** Apenas perfis universitários validados e avaliação em dois sentidos.
* 💰 **Economia:** Divisão de custos de combustível que custa menos que ônibus ou transportes por aplicativo.
* 🤝 **Amizade:** Conexão diária entre estudantes da mesma instituição.
* ⚡ **Praticidade:** Interface direta e poucos toques para publicar ou reservar uma rota.
* 🗽 **Liberdade:** Escolha flexível de trajetos, horários e companhias de viagem.

---

## 🚀 Recursos Principais

* **Busca e Oferta de Caronas:** Seleção de trajetos com origem, destino, horário de saída e vagas disponíveis.
* **Perfis Diferenciados:** Mapeamento específico para Passageiros, Motoristas e Ciclistas (com rotas adaptadas).
* **Painel / Dashboard:** Métricas de caronas realizadas, acompanhamento de economia e selos de sustentabilidade (XP).
* **Sistema de Avaliação:** Feedback mútuo após o encerramento da rota para manter a reputação da rede.

---

## 👥 Integrantes e Papéis

| Integrante | Papel Principal | Frentes de Atuação |
| :--- | :--- | :--- |
| **Gabriel Sousa Sarmento** | Backlog / Branding | Identidade Visual, Definição de Backlog e Layout de Loading Page |
| **Aleck Armando M. De Melo** | Tester / Front-End | Loading Page, Home, Login e Cadastro de Usuário |
| **Arthur Ceregatti D. de Oliveira** | Infraestrutura / Documentação | Gestão de Infraestrutura e Documentação de Reuniões |
| **Breno de Queiroz Chaves** | Front-End / Backlog | Procurar Carona, Oferecer Carona, Meu Perfil e Branding |
| **Gustavo Braga Costa** | Documentação | Redação e Gestão de Documentos Acadêmicos/Atas |
| **João Gabriel de S. Rodrigues** | Front-End / Documentação | Desenvolvimento Front-End e Documentação Técnica |
| **Marco Antônio O. S. Júnior** | Backlog / Branding | Gerenciamento de Backlog e Branding da Plataforma |
| **Nicoly Vaz Moreira** | Front-End | Desenvolvimento da Landing Page do Projeto |

---

## 🔒 Especificações de Perfil e Regras de Negócio

### 1. Usuário Standard (Passageiro / Ciclista)
* **Atributos:** Nome completo, foto de rosto nítida, CPF (validação obrigatória), idade, telefone celular.
* **Parâmetros de Preferência (Mulheres):** Filtro de composição de carona (Apenas Mulheres, Apenas Homens ou Sem Preferência).
* **Perfil Ciclista:** Mapeamento da rota utilizada para navegação conjunta ou apoio.

### 2. Usuário Motorista
* **Atributos:** Nome completo, foto de rosto nítida, CPF e CNH (validação de autenticidade no cadastro).
* **Dados do Veículo:** Placa, modelo, foto, capacidade máxima de passageiros e espaço útil no porta-malas.
* **Recursos & Operação:** Suporte de acessibilidade (ex.: cadeirantes), tempo limite de espera em paradas e estimativa média do valor cobrado por vaga.

---

## 🏆 Sistema de Incentivos e Recompensas

Para incentivar o engajamento dos motoristas e a oferta contínua de vagas:
1. **Estacionamento Prioritário:** Concessão de vagas preferenciais dentro do campus universitário.
2. **Descontos Acadêmicos:** Programa de abatimento ou pontuação para mensalidade acadêmica.
3. **Gamificação (XP):** Acúmulo de pontos de experiência por rotas concluídas para troca de benefícios.
4. **Gorjeta Opcional:** Mecanismo de gratificação voluntária oferecido pelo passageiro ao final da corrida.

---

## 🎨 Guia de Estilo & Identidade Visual (Branding)

### Cores Oficiais

| Nome da Cor | Código Hex | RGB | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Preto UniMove** | `#131313` | `19, 19, 19` | Fundo principal (Modo Escuro), textos e seriedade |
| **Amarelo UniMove** | `#F8D410` | `248, 212, 16` | Destaques, chamadas de atenção e tom amigável |
| **Azul UniMove** | `#0F5DED` | `15, 93, 237` | Cor primária, botões de ação e verificação/segurança |
| **Verde-claro UniMove**| `#86FA01` | `134, 250, 1` | Confirmações, tags de vagas e indicação de economia |
| **Branco-bege UniMove**| `#FFF4CC` | `255, 244, 204`| Fundo padrão (Modo Claro) para maior acolhimento |

### Tipografia
* **Títulos Principais:** `Faster One` (Caixa alta, letter-spacing -26%) — transmite velocidade e praticidade.
* **Subtítulos e Botões:** `Madimi One` — forma arredondada e jovial.
* **Texto Corrido e Descrições:** `Patrick Hand SC` — traço manual que aproxima o leitor.

---

## 📐 Diretrizes de Responsividade & UI/UX

Grade de breakpoints homologada para validação de layout:

* **Mobile Pequeno:** `360px` (Androids compactos)
* **Mobile Padrão:** `390px – 414px` (Smartphones padrão)
* **Tablet Retrato:** `768px` (Tablets verticais)
* **Tablet Paisagem / Desktop Pequeno:** `1024px` (Notebooks e tablets horizontais)
* **Desktop Padrão:** `1280px – 1440px` (Monitores convencionais)
* **Desktop Grande:** `1920px` (Monitores Full HD / Ultrawide)

---

## 💻 Instalação e Execução Local

### Pré-requisitos
* **Node.js** (v18.0.0 ou superior)
* **NPM** ou **Yarn**
* **Git**

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/unimove.git
   cd unimove
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Executar o Ambiente de Desenvolvimento:**
   ```bash
   npm start
   ```
   A aplicação estará acessível em `http://localhost:3000` (ou na porta configurada pelo seu bundler).

4. **Gerar Build para Produção:**
   ```bash
   npm run build
   ```

---

## 📅 Cronograma e Entregáveis

* **24/08:** Entrega do Backlog Completo e Branding.
* **04/09:** Entrega das Telas do Front-End.
* **07/09:** Integração Completa e Testes do Front-End.
* **14/09 a 24/10:** Primeira Apresentação do Projeto.
* **14/11 a 25/11:** Apresentação Final e Validação.

---
*UniMove — Mobilidade Colaborativa Acadêmica*
