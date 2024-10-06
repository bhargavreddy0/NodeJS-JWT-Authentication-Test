const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken')
const { expressjwt: exjwt } = require('express-jwt');


app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});



const PORT = 3000;

const secretKey = "My secret key";

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256'],
});

let users = [
    {
        id:1,
        username:'bhargav',
        password:'123'
    },
    {
        id:2,
        username:'reddy',
        password:'456'
    }
]


app.get('/api/dashboard', jwtMW, (req,res)=>{
    console.log(req);
    res.json({
        success:true,
        myContent:"Secret Content that only logged in people can see it..."
    });
});





app.post('/api/login', (req,res)=>{
    const {username, password} = req.body;
    
    for(let user of users){
        if(username == user.username && password==user.password){
            let token = jwt.sign({id:user.id,username:user.username}, secretKey, {expiresIn:'180s'});
            res.json({
            success: true,
            err: null,
            token
        });
            break;
        }
    

    else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect 2'
        });
    }
}


});

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.use((err,req,res,next)=>{
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success:false,
            officialErr: err,
            err:"2. Username or password is incorrect"
        })
    }
    else{
        next(err);
    }
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Settings page works!!'
    });
});


app.listen(PORT, ()=>{
    console.log(`Serving on port ${PORT}`);
});