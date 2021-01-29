const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const rotaAluno = require('./routes/alunos');
const rotaGabarito = require('./routes/gabarito');
const rotaPergunta = require('./routes/pergunta');
const rotaProva = require('./routes/prova');
const rotaMultiplasEscolhas = require('./routes/multiplas_escolhas');
const rotaRespostas = require('./routes/respostas');

app.use('/alunos', rotaAluno);
app.use('/gabarito', rotaGabarito);
app.use('/pergunta', rotaPergunta);
app.use('/prova', rotaProva);
app.use('/multiplas_escolhas', rotaMultiplasEscolhas);
app.use('/respostas', rotaRespostas);

app.use((req, res, next) => {
  const err = new Error('Não encontrado');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);  
  return res.send({ 
    erro: {
      mensagem: error.message
    }
  })
})

module.exports = app;
