const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `select prova.assunto, pergunta.descricao, resposta from gabarito
        inner join pergunta
          on pergunta.id = gabarito.pergunta_id
        inner join prova 
          on prova.id = gabarito.pergunta_prova_id;`,
        (error, result, field) => { 
          conn.release();
          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
  
          res.status(201).send({
            mensagem: 'Gabarito',
            response: result,
          });
        });
  });
});

router.post('/', (req, res, next) => {
  const pergunta = req.body.pergunta;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `insert into gabarito (resposta, pergunta_id, pergunta_prova_id, peso)
        values (
          (SELECT resposta FROM multiplas_escolhas
            inner join pergunta
              on pergunta.id = multiplas_escolhas.pergunta_id
                and pergunta.descricao = '${pergunta}'
                  and multiplas_escolhas.correta = 1), 
          (select id from pergunta where descricao = '${pergunta}'),
          (select prova_id from pergunta where descricao = '${pergunta}'),
              (select multiplas_escolhas.peso from multiplas_escolhas
            inner join pergunta
              on pergunta.id = multiplas_escolhas.pergunta_id
                and pergunta.descricao = '${pergunta}'
                  and multiplas_escolhas.correta = 1));`,
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        res.status(201).send({
          mensagem: 'Produto Inserido',
          id_produto: result.insertId,
        });
      }
    );
  });
});

module.exports = router;
