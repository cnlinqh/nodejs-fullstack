import express from 'express';
import Data from '../models/data';
import passport from 'passport';
import mypass from '../utils/passport';

mypass(passport);

const router = express.Router();
router.get('/getData', passport.authenticate('bearer', { session: false }), (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, messages: data });
    })
});
// router.get('/getPagedData', passport.authenticate('bearer', { session: false }), (req, res) => {
router.post('/getPagedData', (req, res) => {
    const { filter, skip, limit } = req.body;
    Data.find({ message: new RegExp(filter, 'i') }, {}, { skip, limit, sort: { createdAt: -1 } }, (err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, messages: data });
    })
});

router.post('/putData', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id, message } = req.body;
    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'Invalid Inputs'
        });
    }
    let data = new Data();
    data.id = id;
    data.message = message;
    data.save((err, node) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, node });
    })
});

router.post('/putMessage', passport.authenticate('bearer', { session: false }), (req, res) => {
    // router.post('/putMessage', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.json({
            success: false,
            error: 'Invalid Inputs'
        });
    }
    var findQuery = Data.find().sort({ id: -1 }).limit(1);
    findQuery.exec(function (err, maxResult) {
        if (err) return res.json({ success: false, error: err });
        var id = 0;
        if (maxResult.length !== 0) {
            id = maxResult[0].id + 1;
        }
        let data2 = new Data();
        data2.id = id;
        data2.message = message;
        data2.save((err, node) => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true, node });
        })
    });
});

router.delete('/deleteData', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { _id } = req.body;
    Data.findByIdAndRemove(_id, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, node: { _id } });
    });
});

router.delete('/deleteAll', passport.authenticate('bearer', { session: false }), (req, res) => {
    Data.deleteMany({}, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.post('/updateData', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { _id, update } = req.body;
    Data.findByIdAndUpdate(_id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, node: { _id, update } });
    });
    Data.deleteMany
});

// router.post('/prepareData', (req, res) => {
router.post('/prepareData', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { count, random } = req.body;
    Data.deleteMany({}, (err) => {
        if (err) {
            return res.json({ success: false, message: "Failed to delete all data during preparation." })
        }
    });
    var num = 1000;
    if (count) {
        num = count;
    }
    for (let i = 0; i < num; i++) {
        setTimeout(() => {
            let data = new Data();
            data.id = i;
            if (random) {
                data.message = Math.random().toString(36).substring(2, 15);
            } else {
                data.message = "" + i;
            }
            data.save()
        }, 100*i);
    }
    return res.json({ success: true, message: "server is preparing data, please check later!" });
});

export default router;