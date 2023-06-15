const { Router } = require('express');
const Usuario = require('../models/usuario');
const { validationResult, check } =require('express-validator');
const bycript = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin')

const router = Router();

//crear 
router.post('/',[
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('rol', 'invalid.rol').isIn(['ADMIN', 'DOCENTE']),
    check('contrasena','invalid.contrasena').not().isEmpty(),
    validarJWT,
    validarRolAdmin
], 
    async function(req, res){
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ mensaje: errors.array()});
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email});
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.rol = req.body.rol;

        const salt = bycript.genSaltSync();
        const contrasena = bycript.hashSync(req.body.contrasena, salt);
        usuario.contrasena = contrasena;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        res.send(usuario);


    }catch(error){
        console.log(error)
        res.status(500).json({mensaje: "Internal server error"})
    }
});

//listar
router.get('/',[validarJWT,validarRolAdmin] , async function(req, res) {
    try {
        const usuario = await Usuario.find();
        res.send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
        
    }
    
});

router.put('/:usuarioId', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
      const validaciones = validationResult(req);
  
      if (!validaciones.isEmpty()) {
        return res.status(400).json({ errors: validaciones.array() });
      }
  
      const { usuarioId } = req.params;
      const {
        nombre,
        email,
        rol,
      } = req.body;
  
      const updatedUsuario = await Usuario.findByIdAndUpdate(
        usuarioId,
        {
            nombre,
            email,
            rol,
            contrasena,
          fechaActualizacion: new Date()
        },
        { new: true }
      );
  
      if (!updatedUsuario) {
        return res.status(400).send('No existe el usuario');
      }
  
      res.send(updatedUsuario);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error al actualizar el usuario');
    }
  });

module.exports = router;

