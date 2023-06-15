const { Router } = require('express');
const TipoEquipo = require('../models/tipoequipo');
const { validationResult, check } =require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin')

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

        let tipoequipo = new TipoEquipo();
        tipoequipo.nombre = req.body.nombre;
        tipoequipo.fechaCreacion = new Date();
        tipoequipo.fechaActualizacion = new Date();

        tipoequipo = await tipoequipo.save();

        res.send(tipoequipo);


    }catch(error){
        console.log(error)
        res.status(500).json({mensaje: "Internal server error"})
    }
});

//listar
router.get('/',[validarJWT,validarRolAdmin] , async function(req, res) {
    try {
        const tipoequipo = await TipoEquipo.find();
        res.send(tipoequipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
        
    }
    
})

//Actualizar
router.put('/:tipoEquipoId', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
      const validaciones = validationResult(req);
  
      if (!validaciones.isEmpty()) {
        return res.status(400).json({ errors: validaciones.array() });
      }
  
      const { tipoEquipoId } = req.params;
      const {
        nombre
      } = req.body;
  
      const updatedTipoEquipo = await TipoEquipo.findByIdAndUpdate(
        tipoEquipoId,
        {
            nombre,
          fechaActualizacion: new Date()
        },
        { new: true }
      );
  
      if (!updatedTipoEquipo) {
        return res.status(400).send('No existe el tipo de equipo');
      }
  
      res.send(updatedTipoEquipo);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error al actualizar el tipo de equipo');
    }
  });


module.exports = router;
