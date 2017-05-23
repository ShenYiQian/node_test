import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
    .get(validate(paramValidation.login), authCtrl.login);

router.route('/logintoken')
    .get(validate(paramValidation.loginByToken), authCtrl.loginByToken);

router.get('/testlogin', (req, res) => {
    console.log(req.query);
    return res.json({
        ...req.query
    });
});

router.route('/register')
    .get(validate(paramValidation.register), authCtrl.register);

export default router;
