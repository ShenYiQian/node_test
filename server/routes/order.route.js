import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import orderCtrl from '../controllers/order.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/create')
    .get(validate(paramValidation.createOrder), orderCtrl.createOrder);

export default router;

