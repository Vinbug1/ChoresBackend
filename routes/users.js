const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
    });

 router.get('/:id', async (req, res) =>{
        const user = await User.find().select('-passwordHash');
    
        if(!user) {
            res.status(500).json({success: false})
        } 
        res.send(user);
        });

        // get the list service  providers
router.get('/', async(req, res) => {
    const serviceProvider  = await User.find({ category: 'Service Provider'}).select('name image skill phone address');

    if(!serviceProvider) {
        res.status(500).json({success: false})
    } 
    res.send(serviceProvider);

});


 router.post ('/',uploadOptions.single('image'), async (req, res) => {
     
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         let user = new User({
            image: `${basePath}${fileName}`,
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            address: req.body.address,
            sex: req.body.sex,
            category: req.body.category,
            nin: req.body.nin,
            skill: req.body.skill,
            serviceCharge: req.body.serviceCharge,
            })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user is not be created!')

    res.send(user);


 });

 router.put('/:id', uploadOptions.single('image'),async (req, res)=> {
    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }
    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            image: imagepath,
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            address: req.body.address,
            sex: req.body.sex,
            category: req.body.category,
            nin: req.body.nin,
            skill: req.body.skill,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user details is  updated!')

    res.send(user);
});

router.post('/login', async (req,res) => {

    const user = await User.findOne({email: req.body.email})
   // const secret = process.env.secret;
    if(!user){
        return res.status(404).send('The user not found')
    }

    // if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    //             const token = jwt.sign(
    //                 {
    //                     userId: user.id
    //                 },
    //                 secret,
    //                 {expiresIn : '1d'}
    //             )
               
    //             res.status(200).send({user: user.email , token: token}) 
    //         } else {
    //            res.status(400).send('password is wrong!');
    //         }
    res.status(200).send({user: user.email, paswords: user.password}) 
})

router.post('/register', uploadOptions.single('image'), async (req,res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let user = new User({
        image: `${basePath}${fileName}`,
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        address: req.body.address,
        sex: req.body.sex,
        category: req.body.category,
        nin: req.body.nin,
        skill: req.body.skill,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('user registration failed!');

    res.send(user);
})



router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'user deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
});

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
});


module.exports =router;