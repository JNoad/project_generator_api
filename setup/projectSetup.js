const { dir } = require('console');
const fs = require('fs');
const path = require('path');
const { compileTemplate } = require('./utils');


let routes = [];
let origin;
let db = {

}

let indexCode = `
const express = require('express');
const app = express();
const {userRoutes, orderRoutes, productRoutes} = require('./routes') 
require('dotenv').config
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(express.json());

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", '*') // Update allowed origins when frontend is complete
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next();
});

// Root Route
app.get('/', (req, res) => {
res.status(200);
res.sendFile(path.join(__dirname, '/views/index.html'));
})

// Use router to handle product and user routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', orderRoutes);


app.listen(port, () => {
console.log('Server is running...');
console.log(` + "`Listening on port ${port}...`" + `);
})
`

function createProject(data) {
    createServer(data);
}

async function createServer(data) {
    let projPath = path.join(__dirname, '..', 'output', data.project);
    
    if (!fs.existsSync(projPath)){
        fs.mkdirSync(projPath, { recursive: true });
    }

    fs.writeFileSync(path.join(projPath, 'index.js'), indexCode)
    let dirs = [
        path.join(projPath, 'routes'), 
        path.join(projPath, 'models'),
        path.join(projPath, 'views'),
        path.join(projPath, 'controllers'),
        path.join(projPath, 'config'),
        path.join(projPath, 'middleware'),
    ]

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    let env = fs.readFileSync('./generator/templates/backend/.env', 'utf-8');
    env = compileTemplate(env, {
        DB_HOST: data.databaseHost,
        DB_USER: data.databaseUsername,
        DB_PASS: data.databasePassword,
        DB_NAME: data.databaseName,
    })
    fs.writeFileSync(path.join(projPath, '.env'), env);
    
}

// function writeServerFiles() {

// }

module.exports = {
    createProject
}