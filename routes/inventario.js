const { Router } = require('express');
const Inventario = require('../models/inventario');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin')
const usuario = require('../models/usuario');



const router = Router();

router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    validarJWT,
    validarRolAdmin
], async function (req, res) {

    try {

        const validaciones = validationResult(req);

        if (validaciones.length > 0) {s
            return res.status(400).send(validaciones);
        }

        const existeInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial });
        if (existeInventarioPorSerial) {
            return res.status(400).send('Ya existe el serial para otro equipo');
        }

        let inventario = new Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoequipo = req.body.estadoequipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear inventario');
    }

});

router.get('/', [validarJWT], async function (req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario',
                select: 'nombre email contrasena rol'
            },
            {
                path: 'marca',
                select: 'nombre estado'
            },
            {
                path: 'tipoEquipo',
                select: 'nombre estado'
            },
            {
                path: 'estadoequipo',
                select: 'nombre estado'
            }
        ]);
        res.send(inventarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar inventarios');
    }
});

router.put('/:inventarioId', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
      const validaciones = validationResult(req);
  
      if (!validaciones.isEmpty()) {
        return res.status(400).json({ errors: validaciones.array() });
      }
  
      const { inventarioId } = req.params;
      const {
        serial,
        modelo,
        descripcion,
        foto,
        color,
        fechaCompra,
        precio,
        usuario,
        marca,
        tipoEquipo,
        estadoequipo
      } = req.body;
  
      const updatedInventario = await Inventario.findByIdAndUpdate(
        inventarioId,
        {
          serial,
          modelo,
          descripcion,
          foto,
          color,
          fechaCompra,
          precio,
          usuario,
          marca,
          tipoEquipo,
          estadoequipo,
          fechaActualizacion: new Date()
        },
        { new: true }
      );
  
      if (!updatedInventario) {
        return res.status(400).send('No existe el inventario');
      }
  
      res.send(updatedInventario);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error al actualizar el inventario');
    }
  });
/*router.put('/:inventarioId',[validarJWT,validarRolAdmin], async function (req, res) {

    try {

        const validaciones = validarInventario(req);

        if (validaciones.length > 0) {
            return res.status(400).send(validaciones);
        }

        let inventario = await Inventario.findById(req.params.inventarioId);
        if (!inventario) {
            return res.status(400).send('No existe el inventario');
        }

        const existeInventarioPorSerial = await Inventario.
            findOne({ serial: req.body.serial, _id: { $ne: inventario._id } });
        if (existeInventarioPorSerial) {
            return res.status(400).send('Ya existe el serial para otro equipo');
        }

        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoequipo = req.body.estadoequipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear inventario');
    }


});*/

router.get('/:inventarioId', [validarJWT],async function (req, res) {
    try {
        const inventario = await Inventario.findById(req.params.inventarioId);
        if (!inventario) {
            return res.status(404).send('Inventario no existe');
        }
        res.send(inventario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar inventario');
    }
})

module.exports = router;