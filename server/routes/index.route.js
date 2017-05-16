import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import authCtrl from '../controllers/auth.controller';
import fs from 'fs-extra';

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
        console.log('upload get user success');
        let fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', (fieldname, file, filename) => {
          console.log('Uploading: ' + filename + ' dirname = ' + __dirname);
          let filePath = `${__dirname}/../../public/${filename}`;
          fstream = fs.createWriteStream(filePath);
          file.pipe(fstream);
          fstream.on('close', () => {
            console.log('Upload Finished of ' + filename);
            user.uploadImages[0] = `localhost:4040/public/${filename}`;

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
        console.log('upload error e = '+e);
        return res.json({
          status: 'err',
          msg: e
        })
      })
  }
});

router.get('/testlogin', (req, res) => {
  console.log(req.query);
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
