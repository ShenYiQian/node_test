import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import authCtrl from '../controllers/auth.controller';
import fs from 'fs-extra';
import uuid from 'node-uuid';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.post('/upload', (req, res) => {
  let { token } = req.query;
  if (token == null) {
    return res.json({
      status: 'err',
      msg: '请先登陆'
    });
  } else {
    authCtrl.checkToken(token)
      .then(user => {
        let fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', (fieldname, file, filename) => {
          let saveAs = uuid.v1() + filename;
          let filePath = `${__dirname}/../../public/${saveAs}`;
          fstream = fs.createWriteStream(filePath);
          file.pipe(fstream);
          fstream.on('close', () => {
            user.uploadImages[0] = `localhost:4040/public/${saveAs}`;

            user.save()
              .then(saveUser => {
                return res.json({
                  status: 'ok',
                  file: saveUser.uploadImages[0]
                });
              })
              .catch(e => {
                return res.json({
                  status: 'err',
                  msg: e
                });
              })
          })
        });
      })
      .catch(e => {
        return res.json({
          status: 'err',
          msg: e
        })
      })
  }
});

router.get('/testlogin', (req, res) => {
  console.log(req.query);
  return res.json({
    status: 'ok',
  });
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
