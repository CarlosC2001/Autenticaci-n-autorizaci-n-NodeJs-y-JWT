const { Router } = require('express');
const EstadoEquipo = require('../models/estadoequipo');
const { validationResult, check } =require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');
const estadoequipo = require('../models/estadoequipo');

const router = Router();

//crear 
router.post('/',[
    check('nombre', 'invalid.nombre').not().isEmpty(),
    validarJWT,
    validarRolAdmin
], 
    async function(req, res){
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ mensaje: errors.array()});
        }

        let estadoequipo = new EstadoEquipo();
        estadoequipo.nombre = req.body.nombre;
        estadoequipo.fechaCreacion = new Date();
        estadoequipo.fechaActualizacion = new Date();

        estadoequipo = await estadoequipo.save();

        res.send(estadoequipo);


    }catch(error){
        console.log(error)
        res.status(500).json({mensaje: "Internal server error"})
    }
});

//listar
router.get('/',[validarJWT,validarRolAdmin] , async function(req, res) {
    try {
        const estadoequipo = await EstadoEquipo.find();
        res.send(estadoequipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
        
    }
    
})

//Actualizar
router.put('/:estadoequipoId', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
      const validaciones = validationResult(req);
  
      if (!validaciones.isEmpty()) {
        return res.status(400).json({ errors: validaciones.array() });
      }
  
      const { estadoequipoId } = req.params;
      const {
        nombre
      } = req.body;
  
      const updatedEstadoequipo = await estadoequipo.findByIdAndUpdate(
        estadoequipoId,
        {
            nombre,
          fechaActualizacion: new Date()
        },
        { new: true }
      );
  
      if (!updatedEstadoequipo) {
        return res.status(400).send('No existe el estado de equipo');
      }
  
      res.send(updatedEstadoequipo);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error al actualizar el estado de equipo');
    }
  });


module.exports = router;
