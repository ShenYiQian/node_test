import config from '../../config/config';
import request from 'request';
import path from 'path';
import cheerio from 'cheerio';
import fs from 'fs';

function requestFile() {
    const filePath = path.join(__dirname, '../../public/robot.json');
    let results = [];
    request(config.robotUrl, (error, response, body) => {
        console.log('error = ', error, response.statusCode);
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body);
            console.log('body = ' + body);
            $('a.link-button').each(function (i, e) {
                let result = {};
                $('img.preview-image', e).each(function (i, el) {
                    result.src = el.attribs.src;
                });
                let title = $('span.title', e).text();
                result.title = title;
                result.href = config.robotUrl + e.attribs.href;
                results.push(result);
            });

            fs.writeFile(filePath, JSON.stringify(results), { 'flag': 'a' }, function (err) {
                if (err) {
                    console.log(err);
                }

                console.log('save robot.json success');
            });
        }
    });
}

export default { requestFile };