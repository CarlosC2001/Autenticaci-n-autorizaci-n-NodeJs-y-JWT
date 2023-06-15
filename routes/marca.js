const { Router } = require('express');
const Marca = require('../models/marca');
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

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();

        res.send(marca);


    }catch(error){
        console.log(error)
        res.status(500).json({mensaje: "Internal server error"})
    }
});

//listar
router.get('/',[validarJWT,validarRolAdmin] , async function(req, res) {
    try {
        const marca = await Marca.find();
        res.send(marca);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
        
    }
    
});

//Actualizar
router.put('/:marcaId', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
      const validaciones = validationResult(req);
  
      if (!validaciones.isEmpty()) {
        return res.status(400).json({ errors: validaciones.array() });
      }
  
      const { marcaId } = req.params;
      const {
        nombre
      } = req.body;
  
      const updatedMarca = await Marca.findByIdAndUpdate(
        marcaId,
        {
            nombre,
          fechaActualizacion: new Date()
        },
        { new: true }
      );
  
      if (!updatedMarca) {
        return res.status(400).send('No existe la marca');
      }
  
      res.send(updatedMarca);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error al actualizar la marca');
    }
  });


module.exports = router;
