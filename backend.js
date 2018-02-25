const express = require('express');
const fs = require('fs');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;
const events = require('events');


const app = express();

app.use(expressMongoDb('mongodb://localhost/vemkaBackend'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.get('/', (req, res) => {
    req.db.collection('usuarios').find({})
        .toArray((err, data) => {
            res.send(data);
        });
});

// app.get('/cliente/:id', (req, res) => {
//     let busca = {
//         _id: new ObjectID(req.params.id)
//     };

//     req.db.collection('objetos')
//         .findOne(busca, (err, data) => {
//             res.send(data);
//         });
// });

//pega o feed de eventos
//TODO receber localizacao como parametro
app.get('/getEventos', (req, res) => {
    //CHANGE THIS TO USE PROMISES
    req.db.collection('eventos')
        .find({})
        .toArray((err, eventoData) => {
            req.db.collection('usuarios')
                .find({})
                .toArray((err, userData) => {
                    let flag = true;

                    //TODO OPTIMIZE THIS
                    //SHOULD NOT BE HARD
                    for (evento of eventoData) {
                        flag = true;
                        for (user of userData) {
                            if (flag == true && evento.cliente == user.username) {
                                //this should only happen once
                                evento.cliente = user;
                                flag = false;
                            }
                        }
                    }

                    // SEND TREATED ITEM LIST
                    // TODO: make front end just link images to owners
                    // and not send redundant data
                    res.send(eventoData);
                });
        });
});

//pega todos os itens de um determinado cliente
app.get('/getMeusEventos/:id', (req, res) => {
    let busca = {
        // idCliente: new ObjectID(req.params.id)
        cliente: req.params.id
    };

    req.db.collection('eventos')
        .find(busca)
        .toArray((err, data) => {
            res.send(data);
        });
});

app.post('/evento', (req, res) => {
    console.log(req.body);

    let evento = {
        imagem: req.body.imagem,
        nome: req.body.nome,
        descricao: req.body.descricao,
        tempoInicio: req.body.tempoInicio,
        tempoFim: req.body.tempoFim,
        preco: req.body.preco,
        cliente: req.body.cliente
    };

    if (!req.body.imagem || !req.body.nome || !req.body.descricao || !req.body.preco) {
        res.status(400).send({ 'error': 'Preencha todos os campos obrigatorios' });
        return;
    }

    req.db.collection('eventos')
        .insert(item, (err, data) => {
            if (err) {
                res.status(500).send({});
            }

            res.send(data);
        });
});

app.post('/login', (req, res) => {
    if (!req.body.username || !req.body.senha) {
        res.status(400).send({ 'error': 'Opa! Parece que você esqueceu de preencher alguma coisa!' });
        return;
    }

    let busca = {
        username: req.body.username,
        senha: req.body.senha   //TODO 
    }

    req.db.collection('usuarios')
        .findOne(busca, (err, data) => {
            if (data) {
                res.send(data);
            } else {
                // TODO: use status, but this didnt work
                // res.status(400).send({});
                res.send({});
            }
        });
});

app.post('/cadastro', (req, res) => {
    if (!req.body.telefone || !req.body.firstName || !req.body.lastName || !req.body.adress || !req.body.birthDate || !req.body.email || !req.body.password) {
        res.status(400).send({ 'error': 'Opa! Parece que você esqueceu de preencher alguma coisa!' });
        return;
    }

    if (!agreementContract){
        res.status(400).send({'error': 'Epa! Aceite nossos termos de uso para participar de nossos eventos!'});
    }
    let usuario = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: firstName+' '+lastName,
        telefone: req.body.telefone,
        adress: req.body.adress,
        birthDate: req.body.birthDate,
        email: req.body.email,
        password: req.body.password,
        agreementContract: false,
        local: {
            lat: req.body.local.lat,
            lng: req.body.local.lng
        },
        reputacao: -1
    };

    req.db.collection('usuarios')
        .insert(usuario, (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send(err);
            }

        });
});


// aqui comeca o sistema de box
app.get('/:uid/:boxID', function (req, res) {
    console.log(req.params.uid);
    res.send('OK');

    busca = {
        boxID: req.params.boxID
    }
    objetoVazio = {
        boxID: req.params.boxID,
        uid: '',
        requestLeitura: false
    }

    objetoNovo = {
        boxID: req.params.boxID,
        uid: req.params.uid,
        requestLeitura: false

    }

    req.db.collection('boxs').findOne(busca, (err, data) => {
        if (data) {
            if (data.requestLeitura) {
                req.db.collection('boxs').update(busca, objetoNovo, (err, data) => {
                    console.log("UID atualizado");
                });
            }
        } else {
            req.db.collection('boxs').insert(objetoVazio, (err, data) => {
                console.log("added obejtoVazio");
            });
        }
        console.log("fudeu");
    })


});

app.post('/requestBox', (req, res) => {

    busca = {
        boxID: body.parse.totemId
    }

    req.db.collection('boxs')
        .findOne(busca, (err, data) => {
            if (data) {
                req.db.collection('boxs')
                    .update(busca, { "boxID": data.boxID, "uid": data.uid, requestLeitura: true }, (err, data) => {

                        res.send(data.uid);
                    });
            } else {
                console.log("se fudeu");
            }
        });

});

app.post('/disableItem', (req, res) => {

    busca = {
        boxID: body.parse.totemId
    }



    req.db.collection('boxs')
        .findOne(busca, (err, data) => {
            if (data) {
                req.db.collection('boxs')
                    .update(busca, { "boxID": data.boxID, "uid": '', requestLeitura: false }, (err, data) => {


                    });
            } else {


            }

            res.send(data);
        });

});

app.listen(3000, () => {
    console.log('Servidor rodando na 3000');
});
