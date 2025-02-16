const {Router} = require("express");
const {validateJWT} = require("../middlewares/validate_jwt");
const { obtainEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/fields_validator");
const { isDate } = require("../helpers/isDate");

const router = Router();

//todas tienen que pasar por la validacion del token
router.use(validateJWT);

//obtener eventos
router.get(
    '/',
    obtainEvents
 );


//crear evento
router.post(
    '/',
    [
        check("title", "The title is required").not().isEmpty(),
        check("start", "The start date is required").custom(isDate),
        check("end", "The end date is required").custom(isDate),
        validateFields
    ],
    createEvent
);


//Actualizar evento
router.put(
    '/:id', 
    updateEvent
);

//Borrar evento
router.delete(
    '/:id', 
    deleteEvent
);

module.exports = router;

