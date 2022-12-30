# API DO SISTEMA DE VOTAÇÃO POLLAR

TUTORIAL DE INSTALAÇÃO DO AMBIENTE DE DESENVOLVIMENTO DA API

Passo 1 - Clonagem do repositório com o comando "git clone https://github.com/Hugoleoh/api.git" no terminal dentro da pasta de sua máquina onde deseja manter os arquivos do projeto, é necessário ter o GIT instalado na máquina (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

Passo 2 - Criar um arquivo chamado ".env" na raiz do projeto com o seguinte conteúdo:

MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=True
# Database config
DB_HOST=pollar-database
DB_PORT=3306
DB_USER=root
DB_PASSWORD=''
DB_NAME=pollar

COM DOCKER

Passo 3 -  Tendo o docker instalado na máquina (https://docs.docker.com/get-docker/), rodar o comando "docker compose up", no linux "sudo docker compose up", no diretório do projeto. O docker criará automaticamente o banco de dados do projeto e iniciará a execução da api na porta 3000.

SEM DOCKER

Passo 3 -  Sem o docker será necessário ter o npm e o node instalados na máquina (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Passo 4 - Criar a conexão do banco de dados com as seguintes credencias:
![image](https://user-images.githubusercontent.com/62120466/210077701-1e4f7fcc-62e3-41d5-872a-85e9c7ce4e9d.png)

Passo 5 - Importar o dump do banco presente na pasta api/src/db/pollar.sql

Passo 6 - Rodar comando "npm install" no diretório do projeto api, para configuração inicial do ambiente 

Passos 7 - Rodar o comando npm start para iniciar a execução da api


Obs.: 

- A documentação Swagger da api pode ser acessar no endereço "http://localhost:3000/doc/"
- Para visualizar o banco de dados é recomendado criar uma conexão em um SGBD com as credenciais apresentadas no passo 3 sem o docker
