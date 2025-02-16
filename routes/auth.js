const {Router} = require("express");
const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/fields_validator");
const { validateJWT } = require("../middlewares/validate_jwt");

const router = Router();

router.post(
    "/new", 
    [
        check("name", "The name is required").not().isEmpty(),
        check("email", "The email is required").isEmail(),
        check("password", "The password must be at least 6 characters").isLength({min: 6}),
        validateFields
    ], 
    createUser
);

router.post(
    "/",
    [
        check("email", "The email is required").isEmail(),
        check("password", "The password must be at least 6 characters").isLength({min: 6}),
        validateFields
    ], 
    loginUser
);

router.get(
    "/renew",
    [
        validateJWT
    ],
    renewToken
);

module.exports = router;