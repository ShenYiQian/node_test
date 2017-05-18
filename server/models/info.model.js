import Promise from 'bluebird';
import mongoose, { Schema } from 'mongoose';

const InfoSchema = new mongoose.Schema({
    freeTimes: [
        {
            office: { type: String, required: true },
            times: [
                {
                    weekday: { type: Number, min: 1, max: 7 },
                    interval: { type: String, enum: ['上午', '下午'] },
                    orderIds: [Schema.Types.ObjectId]
                }
            ]
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

InfoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

InfoSchema.statics = {
    findInfoById(id) {
        return this.findById(id)
            .exec()
            .then(info => {
                if (info) {
                    return info;
                }
                return Promise.reject('没有找到该信息');
            });
    },

    findInfoByOwner(owner) {
        return this.findOne({ owner })
            .exec()
            .then(info => {
                if (info) {
                    return info;
                }
                return Promise.reject('没有找到该用户的信息');
            })
    }
};

export default mongoose.model('Info', InfoSchema);