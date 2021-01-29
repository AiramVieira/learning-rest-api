const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    conn.query(
      `select resposta, correta, multiplas_escolhas.descricao, peso, pergunta.descricao from multiplas_escolhas
        inner join pergunta
          on pergunta.prova_id = multiplas_escolhas.pergunta_id
            order by pergunta.descricao, resposta;;`,
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

router.post('/cria_opcao_resposta', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const pergunta = req.body.pergunta;
    const opcao_letra = req.body.opcao_letra;
    const resposta_certa = req.body.resposta_certa;
    const descricao_opcao = req.body.descricao_opcao;
    const peso = req.body.peso;

    conn.query(
      `insert into multiplas_escolhas (pergunta_id, resposta, correta, descricao, peso)
         values ((select id from pergunta where descricao = "${pergunta}"), "${opcao_letra}", ${resposta_certa}, "${descricao_opcao}", ${peso});`,
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: result,
          });
        }

        res.status(201).send({
          mensagem: 'Opção de resposta criada',
          pergunta: req.body.pergunta
        });
      }
    );
  });
});

module.exports = router;
