const {DoneTask} = require('../models/donetask');
const {Task} = require('../models/task');
const {Category} = require('../models/category');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const multer = require('multer');

router.get('/', async(req, res) => {
 
    let filter = {};
    if (req.query.users || req.query.tasks) {
        filter = { user: req.query.users.split(',') };
    } else {
        filter = {task: req.query.tasks.split(',') };
    }
    const doneTaskList = await DoneTask.find(filter).populate('user','task');
    if (!doneTaskList) {
        res.status(500).json({success: false});
    }
    res.send(doneTaskList);
});

// getting user histories
router.get('/get/userhistories/:userid', async(req, res) => {
    const userTaskHistory = await DoneTask.find(req.params.userid).populate({
         path:'tasks', populate:'user'}).sort({'createdOn': -1});

    if (!userTaskHistory) {
        res.status(500).json({success: false});

    }
    res.send(userTaskHistory);
});

router.post('/', async (req, res) =>{
    const tasksIds = promise.all(req.params.tasks.map(async task =>{
        let newTask = new Task({
            name: task.name,
            description: task.description,
            addresses: task.addresses,
            duration: task.duration,
            budget: task.budget,
            cost: task.cost,
            client: task.user
        })
        newTask = await newTask.save();
        return newTask._id;

    }))
     const tasksIdsResolved = await tasksIds;

    let doneTask = new DoneTask({
        task: tasksIdsResolved,
        review: req.body.review,
        rating: req.body.rating,
        vendor: req.body.user

    });

    doneTask = await doneTask.save();

    if(!doneTask) return res.status(500).send('The doneTask cannot be created');

    res.send(doneTask);
});

router.put('/:id', async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('invalid Task');
    }
    // const taskCategory = await TaskCategory.findById(req.body.taskCategory);
    // if (!taskCategory) return res.status(400).send('Invalid taskCategory');
     
    const updateDOneTask = await Task.findByIdAndUpdate(
        req.params.id,{
            task: req.body.task,
            userReview: req.body.review,
            rating: req.body.rating,
            vendor: req.body.user,
             
        },
        { new: true}
    );
    if(!updateDOneTask) return res.status(500).send('this task cannot be updated!');
    res.send(updateDOneTask);
});

router.delete('/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id).then((task) =>{
        if(task){
            return res.status(200).json({success: true, message:'This task is deleted',});
        }else{
            return res.status(404).json({success:false,message:'Task notfound!'});
        }
    }).catch((err) => {
        return res.status(500).json({success:false, error:err});
    });
});



module.exports = router;


