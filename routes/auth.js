const { Router } = require('express');
const Usuario = require('../models/usuario');
const { validationResult, check } =require('express-validator');
const bycript = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const router = Router();

router.post('/',[
    check('email', 'invalid.email').isEmail(),
    check('contrasena','invalid.contrasena').not().isEmpty()
],  async function(req, res){

    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ mensaje: errors.array()});
        }

        const usuario = await Usuario.findOne({ email: req.body.email});
        if (!usuario) {
            return res.status(400).send({ mensaje: 'User not found'});
        }

        const esIgual = bycript.compareSync(req.body.contrasena, usuario.contrasena);
        if (!esIgual) {
            return res.status(400).send({ mensaje: 'User not found'});
        }

        //generar token
        const token = generarJWT(usuario);

        res.json({ _id: usuario._id, nombre: usuario.nombre, 
            rol: usuario.rol, email: usuario.email, access_token: token});

    } catch (error) {
        console.log(error);
        res.status(500).json({ mesaje: 'Internal server error' });
    }

});

module.exports = router;
