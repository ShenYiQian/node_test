import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/profile')
  .get(validate(paramValidation.profile), userCtrl.profile);

router.route('/update')
  .get(validate(paramValidation.updateUser), userCtrl.updateUser);

export default router;
