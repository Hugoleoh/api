API DO SISTEMA DE VOTAÇÃO POLLAR

TUTORIAL DE INSTALAÇÃO DO AMBIENTE DE DESENVOLVIMENTO DA API

Passo 1 - Clonagem do repositório com o comando "git clone https://github.com/Hugoleoh/api.git" no terminal dentro da pasta de sua máquina onde deseja manter os arquivos do projeto, é necessário ter o GIT instalado na máquina (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

COM DOCKER

Passo 2 -  Tendo o docker instalado na máquina (https://docs.docker.com/get-docker/), rodar o comando "docker compose up", no linux "sudo docker compose up", no diretório do projeto. O docker criará automaticamente o banco de dados do projeto e iniciará a execução da api na porta 3000.

SEM DOCKER

Passo 2 -  Sem o docker será necessário ter o npm e o node instalados na máquina (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Passo 3 - Criar a conexão do banco de dados com as seguintes credencias ... e importar o dump do banco presente na pasta api/src/db/pollar.sql

Passos 4 - Rodar o comando npm start para iniciar a execução da api


Obs.: A documentação Swagger da api pode ser acessar no endereço "localhost:3000/docs"
