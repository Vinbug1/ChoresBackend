const express = require('express');
const app = express();
require('dotenv/config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
//const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors())


//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('tiny'));
//app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Router
const categoriesRoutes = require('./routes/categories');
//const taskCategoriesRoutes = require('./routes/taskCategories');
const tasksRoutes = require('./routes/tasks');
const doneTasksRoutes = require('./routes/doneTasks');
const usersRoutes = require('./routes/users');

const api = process.env.API_URL;

//Api
app.use(`${api}/categories`, categoriesRoutes);
//app.use(`${api}/taskCategories`, taskCategoriesRoutes);
app.use(`${api}/tasks`, tasksRoutes);
app.use(`${api}/doneTasks`, doneTasksRoutes);
app.use(`${api}/users`, usersRoutes);



mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'chores-database'
    })
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(4000, () => {
    console.log('server is runing at http://localhost:4000');
})