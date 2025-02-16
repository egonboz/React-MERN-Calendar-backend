const {response} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const { email, password } = req.body;
    
    try{
       let user = await User.findOne({email});
        console.log(user);
       if (user) {
              return res.status(400).json({
                ok: false,
                msg: "The user already exists with that email"
              });
         }

        user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generate JWT
        const token = await generateToken(
            user.id,
            user.name
        );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Please contact the administrator"
        });

    }
}

const loginUser = async(req, res = response) => {
    const { email, password } = req.body;

    try{
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: "The user does not exist with that email"
            });
        }

        // Confirm passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Incorrect password"
            });
        }

        // Generate JWT
        const token = await generateToken(
            user.id,
            user.name
        );

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Please contact the administrator"
        });
    }

}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    try{
        // Generate JWT
        const token = await generateToken(
            uid,
            name
        );


        res.status(200).json({
            ok: true,
            uid,
            name,
            token
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Please contact the administrator"
        });
    }
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}