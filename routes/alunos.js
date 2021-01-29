const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `select * from aluno`,
        (error, result, field) => { 
          conn.release();
          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
  
          res.status(201).send({
            mensagem: 'Busca de alunos',
            response: result
          });
        });
  });
});

router.get('/reprovados', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `select nome, 
        (select sum(1 * gabarito.peso) nota from gabarito
          inner join respostas
            on gabarito.pergunta_id = respostas.pergunta_id
              and respostas.resposta = gabarito.resposta) nota
        from aluno
          where (select sum((1 * gabarito.peso)) nota from gabarito
          inner join respostas
            on gabarito.pergunta_id = respostas.pergunta_id
              and respostas.resposta = gabarito.resposta
          inner join aluno 
            on respostas.aluno_id = aluno.id) < 7;`,
        (error, result, field) => { 
          conn.release();
          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
  
          res.status(201).send({
            mensagem: 'Busca de alunos',
            response: result
          });
        });
  });
});

router.get('/aprovados', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `select nome, 
        (select sum(1 * gabarito.peso) nota from gabarito
          inner join respostas
            on gabarito.pergunta_id = respostas.pergunta_id
              and respostas.resposta = gabarito.resposta) nota
        from aluno
          where (select sum(1 * gabarito.peso) nota from gabarito
          inner join respostas
            on gabarito.pergunta_id = respostas.pergunta_id
              and respostas.resposta = gabarito.resposta
          inner join aluno 
            on respostas.aluno_id = aluno.id) > 6;`,
        (error, result, field) => { 
          conn.release();
          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
  
          res.status(201).send({
            mensagem: 'Alunos aprovados',
            response: result
          });
        });
  });
});

router.post('/adicionar_aluno', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `insert into aluno (nome)
        values ("?");`,
      [req.body.nome_aluno],
      (error, result, field) => {
        conn.release();
        
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        res.status(201).send({
          mensagem: 'Alunos adicionado'
        });
      }
    )
  })
})

module.exports = router;
