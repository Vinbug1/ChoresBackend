const expressJwt = require('express-jwt');

function authJwt(){    
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret: secret,
         algorithms: ['HS256'],
         isRevoked: isRevoked,
    }).unless({
        //to allow user see my tasks list
        path: [
        {url: /\/public\/uploads(.*)/, methods:['GET','OPTIONS']},
        {url: /\/api\/v1\/tasks(.*)/, methods:['GET','POST','OPTIONS']},
        {url: /\/api\/v1\/doneTasks(.*)/, methods:['GET','OPTIONS']},
         {url: /\/api\/v1\/categories(.*)/, methods:['GET','OPTIONS']},
       // {url: /\/api\/v1\/taskCategories(.*)/, methods:['GET','OPTIONS']},
        `${api}/users/login`,
        `${api}/users/register`,
    ]
    })
}

async function isRevoked (req,payload,done) {
    if(!payload.isAdmin){
        done(null, true)
    }
    done();
}

module.exports = authJwt;