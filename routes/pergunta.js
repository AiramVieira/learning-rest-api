const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    console.log(conn);
    
    conn.query(
      `select assunto, pergunta.descricao from prova
        inner join pergunta
          on prova.id = pergunta.prova_id;`,
        (error, result, field) => { 
          conn.release();
          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
  
          res.status(201).send({
            mensagem: 'Listado todas as questões',
            response: result
          });
        });
  });
});

router.post('/cria_pergunta', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `insert into pergunta (descricao, prova_id)
        values ("?", 
          (select id from prova where assunto = "?"));`,
      [req.body.descricao, req.body.assunto],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        res.status(201).send({
          mensagem: 'Pergunta Inserida'
        });
      }
    );
  });
});

module.exports = router;
