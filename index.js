const express = require('express');
const { mongoConn } = require('./bd/db-connet-mongo');
const cors = require('cors');
require('dotenv').config();


const app = express();
const host = '0.0.0.0';
const port = process.env.PORT;

 //Implementacion de cors a traves del middleware
app.use(cors());

mongoConn();

//Parseo JSON
app.use(express.json());
app.use('/inventario', require('./routes/inventario'));
app.use('/estado', require('./routes/estado'));
app.use('/marca', require('./routes/marca'));
app.use('/tipoequipo', require('./routes/tipoEquipo'));
app.use('/usuario', require('./routes/usuario'));
app.use('/auth', require('./routes/auth'));

app.listen(port, host, () => {
    console.log('Ejecutando por el puerto: ',port)
});