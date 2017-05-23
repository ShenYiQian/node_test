import Crypto from 'crypto';
import config from '../../config/config';

export function sha1(str) {
    const hash = Crypto.createHash('sha1');
    hash.update(str);
    hash.update(config.secretKey);
    return hash.digest('hex');
}

export function dateDiff(dS, dE, interval = 'd') {
    console.log('dS = ' + dS + '   dE = ' + dE);
    switch (interval) {
        case 's':
            return parseInt((dE - dS) / 1000);
        case 'n':
            return parseInt((dE - dS) / 60000);
        case 'h':
            return parseInt((dE - dS) / 3600000);
        case 'd':
            return parseInt((dE - dS) / 86400000);
        case 'w':
            return parseInt((dE - dS) / (86400000 * 7));
        case 'm':
            return (dE.getMonth() + 1) + ((dE.getFullYear() - dS.getFullYear()) * 12) - (dS.getMonth() + 1);
        case 'y':
            return dE.getFullYear() - dS.getFullYear();
    }
}