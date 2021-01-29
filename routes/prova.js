const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `select assunto from prova;`,
        (error, result, field) => { 
          conn.release();
          if (error) {
            return res.status(500).send({
              error: error,
              response: null,
            });
          }
  
          res.status(201).send({
            mensagem: 'Listado todas as provas',
            response: result
          });
        });
  });
});

router.post('/assunto_prova', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `insert into prova (assunto)
        values (?)`,
      [req.body.assunto],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }

        res.status(201).send({
          mensagem: 'Prova Criada'
        });
      }
    );
  });
});

module.exports = router;
