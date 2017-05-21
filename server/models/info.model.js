import mongoose, { Schema } from 'mongoose';

const InfoSchema = new mongoose.Schema({
    freeTimes: {
        type: Schema.Types.Mixed,
        required: true
    },
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