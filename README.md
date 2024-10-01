# API-ADS-3-Sem-Fatec

# Dashboard para Feedback e Pesquisa de Clima e Cultura de equipes


<p align="center">
      <img src="/docs/img/codeplay.png" alt="CODEPLAY">

<span id="topo">
<p align="center">
    <a href="#sobre">Sobre</a>  |  
    <a href="#backlogs">Backlog do Produto</a>  |  
    <a href="#requisitosfuncionais">Lista de Requisitos Funcionais</a>  | 
    <a href="#requisitosnfuncionais">Lista de Requisitos Não Funcionais</a>  | 
    <a href="#planejamento">Planejamento das Sprints</a>  |   
    <a href="#tecnologias">Tecnologias</a>  |  
    <a href="#equipe">Equipe</a>  |  
    <a href="#focal">Focal Point</a>  
    
</p>
   
<span id="sobre">

## :bookmark_tabs: Sobre o projeto

A empresa parceira vem enfrentando dificuldades para registrar a auto avalição e avaliação dos membros de suas equipes uma vez que suas equipes se tornaram maiores e mais dispersas. Para enfrentar esse desafio, a empresa está em busca de um Dashboard para Feedback e Pesquisa de Clima e Cultura de equipes

O Dashboard proposto pela Youtan deve ser capaz de:

1. **Bem-estar e Desenvolvimento da Equipe:** Promover o bem-estar e motivação da equipe, reduzir índices de turnover (rotatividade) e
Fomentar o desenvolvimento profissional dos colaboradores.

2. **Desafios no Processamento Manual:** Quanto maior a equipe, maior o tempo para realizar feedbacks individuais e garantir que todos os colaboradores sejam contemplados nos processos de pesquisa.

3. **Soluções Automatizadas:** Implementar soluções tecnológicas que acelerem e automatizem a aplicação de feedbacks e pesquisas de clima. Acompanhamento contínuo do desenvolvimento dos colaboradores ao longo do tempo.

4. **Feedback Multidimensional:** Envolver autoavaliação, avaliação dos líderes e dos liderados. Abranger categorias como Comportamento, Habilidades Técnicas, e Expectativas.

5. **Papel do RH no Processo:** RH como responsável por criar e organizar perguntas de avaliação e autoavaliação. Acesso às respostas para suporte no desenvolvimento das equipes e inovações internas.

6. **Desenvolvimento de Solução Tecnológica:** Necessidade de uma plataforma onde o RH possa cadastrar perguntas e categorizar avaliações. Organização das respostas em dashboards para monitorar a evolução individual e coletiva.

> _Projeto baseado na metodologia ágil SCRUM, procurando desenvolver a Proatividade, Autonomia, Colaboração e Entrega de Resultados dos estudantes envolvidos_

:pushpin: Status do Projeto: **Em desenvolvimento** 🚧

### 🏁 Entregas das Sprints

As entregas de valor de cada sprint. Os stakeholders podem acompanhar de perto o desenvolvimento do projeto e entender como as metas e objetivos estão sendo alcançados ao longo do tempo.
| Sprint | Previsão de entrega | Status |
|:--:|:----------:|:-------------------|
| 01 | 14/04/2024 | :white_check_mark: Concluído |
| 02 | 05/05/2024 | :white_check_mark: Concluído |
| 03 | 26/05/2024 | :white_check_mark: Concluído |
| 04 | 16/06/2024 | :white_check_mark: Concluído |

→ [Voltar ao topo](#topo)

<span id="backlogs">

## :dart: Backlog do Produto

| **Sprint** | **Prioridade** | **User Story** | **Estimativa** | **Requisito** | **Critério de Aceitação** |
|------------|----------------|----------------|----------------|---------------|---------------------------|
| **1** | Alta | Eu, como usuário, quero usar uma interface navegável e finalizada para ter uma experiência consistente e intuitiva ao navegar e interagir com o sistema. | 8h | - | Protótipo navegável validado |
|       | Alta | Eu, como usuário, quero ver uma tela funcional para o cadastro de líderes e liderados para inserir e gerenciar os dados de forma eficiente. | 10h | RF1 | Tela de cadastro funcional e validada |
|       | Alta | Eu, como desenvolvedor, quero modelar um banco de dados relacional para garantir a integridade referencial dos dados. | 8h | RNF2 | Esquema de banco de dados validado |
|       | Alta | Eu, como desenvolvedor, quero definir os requisitos detalhados do sistema para garantir que o desenvolvimento esteja alinhado às expectativas do parceiro. | 6h | - | Requisitos documentados e validados |
| **2** | Alta | Eu, como desenvolvedor, quero implementar autenticação e controle de acesso para garantir que os usuários possam acessar apenas as informações pertinentes ao seu nível de acesso. | 10h | RF1 | Autenticação funcional |
|       | Alta | Eu, como desenvolvedor, quero criar uma API para o cadastro de perguntas e categorias para permitir a inserção e gerenciamento das perguntas de forma eficiente. | 12h | RF2, RF3, RF4 | API funcional com testes |
| **3** | Alta | Eu, como usuário, quero acessar o dashboard geral para Admin para visualizar todas as informações e comparar avaliações de maneira abrangente. | 16h | RF5 | Dashboard funcional para Admin |
|       | Alta | Eu, como usuário, quero utilizar filtros de data nos dashboards para visualizar informações em diferentes períodos de tempo. | 6h | RF6 | Filtros de data funcionando |
| **4** | Alta | Eu, como usuário, quero acessar o dashboard pessoal para visualizar e acompanhar meus dados de autoavaliação. | 12h | RF5 | Dashboard funcional para autoavaliação |
|       | Média | Eu, como usuário, quero baixar meus dashboards em PDF para poder ter uma cópia offline das minhas informações. | 4h | RF7 | PDF gerado e funcional para todos os perfis |
|       | Baixa | Eu, como desenvolvedor, quero revisar e refatorar o código para garantir que ele esteja legível, mantenível e eficiente. | 6h | RNF4 | Código revisado e otimizado |
|       | Média | Eu, como desenvolvedor, quero completar a documentação da API para fornecer informações claras e completas para outros desenvolvedores. | 6h | RNF3 | Documentação disponível |
|       | Média | Eu, como usuário, quero garantir que a interface seja responsiva e amigável em diferentes dispositivos e tamanhos de tela para ter uma boa experiência de uso. | 8h | RNF1 | Interface testada em diferentes dispositivos e tamanhos de tela |

<p align="center">
     

<span id="requisitosfuncionais">

## :dart: Lista de Requisitos Funcionais

1. **RF1** – O sistema deve permitir o cadastro de usuários com diferentes níveis de acesso (Admin, Líder, Liderado).
2. **RF2** – O Admin deve poder cadastrar pesquisas de autoavaliação, avaliação de liderança e avaliação de liderado.
3. **RF3** – O Admin deve poder cadastrar categorias de perguntas para organizar as pesquisas.
4. **RF4** – As perguntas devem ser cadastradas nos formatos texto longo, escolha única e múltipla escolha.
5. **RF5** – Todos os usuários devem poder acessar seus dashboards (pessoal, liderados, geral) de acordo com o nível de acesso.
6. **RF6** – Dashboards devem apresentar filtros de data para visualização de informações ao longo do tempo.
7. **RF7** – Todos os usuários devem poder fazer download do dashboard em PDF.

<p align="center">
    

<span id="requisitosnfuncionais">

## :dart: Lista de Requisitos Não Funcionais

1. **RNF1** – A aplicação deve ser responsiva e acessível em diferentes dispositivos.
2. **RNF2** – O banco de dados deve ser relacional e garantir integridade referencial.
3. **RNF3** – A documentação da API deve estar completa e disponível para os desenvolvedores.
4. **RNF4** – O código deve ser revisado para garantir legibilidade, manutenção e eficiência.

<p align="center">
    

<span id="planejamento">

## :dart: MVP das Sprints

| **MVP** |
|------------|
|**Sprint 1 –** *"Estruturação, Protótipo e Banco de Dados"*  
  **MVP:** Definição do backlog, criação do protótipo navegável, desenvolvimento da tela funcional de cadastro de líderes e liderados, modelagem do banco de dados relacional, e organização dos requisitos principais.|
|**Sprint 2 –** *"Autenticação e API"*  
  **MVP:** Autenticação funcional e API para cadastro de perguntas e categorias.|
|**Sprint 3 –** *"Dashboards Interativos"*  
  **MVP:** Dashboard geral para Admin e filtros de data implementados.|
|**Sprint 4 –** *"Funcionalidades Avançadas e Refinamento"*  
  **MVP:** Dashboard pessoal funcional, funcionalidade de download em PDF, interface responsiva e amigável, código revisado e documentado.|



→ [Voltar ao topo](#topo)

<span id="tecnologias">

## 🛠️ Tecnologias

As seguintes ferramentas, linguagens, bibliotecas e tecnologias foram usadas na construção do projeto:

<table>
  <thead>
    <th><img
    src="https://user-images.githubusercontent.com/89823203/190877360-8c7f93cf-5f62-4f49-8641-3b605deb513e.png"
    alt="Alt text"
    title="Figma"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
    <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg" /></th>
    <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
    alt="Alt text"
    title="React"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
    <th><img
    src="https://user-images.githubusercontent.com/89823203/190717820-53e9f06b-1aec-4e46-91e1-94ea2cf07100.svg"
    alt="Alt text"
    title="JavaScript"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
     <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
    alt="Alt text"
    title="TypeScript"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
     <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg"
    alt="Alt text"
    title="Node.Js"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
  </thead>

  <tbody>
    <td>Figma</td>
    <td>MySQL</td>
    <td>React</td>
    <td>JavaScript</td>
    <td>Typescript</td>
    <td>Node.Js</td>
  </tbody>

</table>
    
→ [Voltar ao topo](#topo)

<span id="equipe">

## :bust_in_silhouette: Equipe

|    Função     | Nome                             |                                                                                                                                                            LinkedIn & GitHub                                                                                                                                                            |
| :-----------: | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Product Owner | Daniel Sendreti       |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/danielbroder/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/d-broder)           |
| Scrum Master  | Breno Jesus    |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/brenoaugusto1910/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/brenoasj)         |
|   Dev Team    | André Neves |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/andre-neves-44807a209/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/andreN4vs) |
|   Dev Team    | Gabriel Carvalho |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-carvalho-30598b292/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Gabriecarvalho) |
|   Dev Team    | Gabriel Vasconcelos      |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-vasconcelos-255979262/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gabrielvascf)|
|   Dev Team    | Gabriel Silva  |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-silva--cs/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gabrielfelip)         |
|   Dev Team    | Guilherme Dharen|[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gu%C3%ADlherm-p%C3%AAreira-7993aa7a/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gui863)              |
|   Dev Team    | Matheus Marques        |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/matmarquesx/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/matmarquesx)         |
|   Dev Team    | Ana Clara Tolomelli     |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/anaclaratolomelli/ ) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ninabtolo)   |

→ [Voltar ao topo](#topo)

<span id="focal">

## 🚀 Focal Point<a id="focal"></a>

|                                                                                                     PO²                                                                                                      |                                                                                   M²                                                                                   |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <a href=''>Prof. Fernando Masanori </a> | <a href=''>Claudio Lima </a> |

→ [Voltar ao topo](#topo)
