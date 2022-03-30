const {Task} = require('../models/task');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


router.get('/', async (req, res) => {
    const taskList = await Task.find().populate('user','name');
    if (!taskList) {
        res.status(500).json({
            success: false
        });
    }
    res.send(taskList);
});

router.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id).populate({path:'task',populate:{
        path:'user','name'
    }}).select('name description cost ');

    if (!task) {
        res.status(500).json({
            success: false
        });

    }
    res.send(task);
});

router.post('/', async (req, res) => {
    let task = new Task({
        name: req.body.task.name,
        description: req.body.task.description,
        address: req.body.task.address,
        duration: req.body.task.duration,
        budget: req.body.task.budget,
        cost: req.body.task.cost,
        user: req.body.task.user,
        status: req.body.status,
    });

    task = await task.save();
    if (!task) return res.status(500).send('The task cannot be created');
    res.send(task);
});


router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('invalid Task');
    }
 
    const task = await Task.findByIdAndUpdate(
        req.params.id, {
            status: req.body.status,
            createdOn: req.body.Date.now
        },
         { new: true  }
    )
     task = await task.save();
    if (!task)
     return res.status(500).send('this task cannot be updated!')
    res.send(task);
});

router.delete('/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id).then((task) => {
        if (task) {
            return res.status(200).json({
                success: true,
                message: 'This task is deleted',
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Task notfound!'
            });
        }
    }).catch((err) => {
        return res.status(500).json({
            success: false,
            error: err
        });
    });
});

// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.query.count ? req.params.count : 0;
//     const tasks = await Task.find({
//         isFeatured: true
//     }).limit(+count);
//     if (!tasks) {
//         res.status(500).json({
//             success: false
//         });
//     }
//     res.send(tasks);
// });

module.exports = router;