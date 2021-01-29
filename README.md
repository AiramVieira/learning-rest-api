# Desafio Rest Api

Um projeto feito em node para aprender a fazer api rest.

## Instalação

Programas utilizados
	
	~Node, versão 14.15.4, site para download https://nodejs.org/en/download/;
	~Docker, versão 20.10.2, site para download https://docs.docker.com/docker-for-windows/install/;
	~MySQL Workbench, versão 8.0.23, site para download https://dev.mysql.com/downloads/installer/
	
~No terminal:

```npm
npm install morgan --save
npm install mysql2 --save
npm install express --save
npm install body-parser --save

npm install nodemon --save-dev
```

## Modo de uso

~Executar o schema do MySQL:
    path: data-base/sql-schema

~No terminal:

```docker
docker pull mariadb

docker run -p 3306:3306 --name mysql-mariadb -e MYSQL_ROOT_PASSWORD=root -d mariadb
```

```npm
npm start
```

## Passo a passo

~Cadastrar o assunto da prova:
	@POST
	@Params
		assunto: String
	@Url
		localhost:3000/prova/assunto_prova
		
~Cadastrar a pergunta para a prova
	@POST
	@Params
		descricao: String
		assunto: String
	@Url
		localhost:3000/pergunta/cria_pergunta
		
~Cadastrar a opção de resposta
	@POST
	@Params
		pergunta: String
		opcao_letra: String
		resposta_certa: Tinyint	-> 0 = false, 1 = true
		descricao_opcao: String
		peso: SmallInt
	@Url
		localhost:3000/multiplas_escolhas/cria_opcao_resposta
		
~Cadastrar Aluno
	@POST
	@Params
		nome_aluno: String
	@Url
		localhost:3000/aluno/adicionar_aluno
		
~Cadastrar Resposta do Aluno
	@POST
	@Params
		resposta: String -> Letra da múltipla escolha
		nome_aluno: String
		descricao_pergunta: String,
		assunto_prova: String
	@Url
		localhost:3000/respostas/resposta_aluno
		
~Buscar Alunos Aprovados
	@GET
	@Url
		localhost:3000/alunos/aprovados	