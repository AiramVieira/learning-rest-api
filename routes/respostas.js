const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.post('/resposta_aluno', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `INSERT INTO respostas (resposta, aluno_id, pergunta_id, pergunta_prova_id)
        VALUES ("${req.body.resposta}", 
          (select id from aluno where nome = "${req.body.nome_aluno}"),
              (select pergunta.id from pergunta
            inner join prova
              on pergunta.prova_id = prova.id
                and pergunta.descricao = "${req.body.descricao_pergunta}"),
              (select id from prova where assunto = "${req.body.assunto_prova}"));`,
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        res.status(201).send({
          mensagem: 'Pergunta Respondida',
          pergunta: req.body.descricao_pergunta,
          resposta: req.body.resposta
        });
      }
    );
  });
});

module.exports = router;
