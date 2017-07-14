import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import authCtrl from '../controllers/auth.controller';
import fs from 'fs';
import uuid from 'node-uuid';
import path from 'path';
import request from 'request';
import cheerio from 'cheerio';

const router = express.Router(); // eslint-disable-line new-cap
const robotUrl = 'http://cn.bing.com/search?q=%E5%A4%9A%E7%82%B9%E6%89%A7%E4%B8%9A&qs=n&form=QBRE&sp=-1&pq=%E5%A4%9A%E7%82%B9%E6%89%A7%E4%B8%9A&sc=8-4&sk=&cvid=2DDBDB23273B4B98B57B6FA92FD7581E';

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

router.get('/robot', (req, res) => {
    const filePath = path.join(__dirname, '../../public/robot.json');
    let results = [];
    fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) {
            console.log('readFile err');
            request(config.robotUrl, (error, response, body) => {
                console.log('error = ', error, response.statusCode);
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(body);
                    $('li.b_algo').each(function (i, e) {
                        let title = $('a', e).text();
                        let href = $('a', e).attr('href');
                        let param = $('p', e).text();
                        results.push({
                            title,
                            href,
                            param
                        });
                    })

                    fs.writeFile(filePath, JSON.stringify(results), { 'flag': 'a' }, function (err) {
                        if (err) {
                            console.log(err);
                        }

                        console.log('save robot.json success');
                    });

                    return res.json({
                        status: 'ok',
                        results
                    })
                }
            });
        } else {
            console.log('robot from json');
            results = JSON.parse(data);

            return res.json({
                status: 'ok',
                results
            });
        }
    })
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
