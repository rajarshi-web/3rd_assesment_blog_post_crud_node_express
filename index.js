require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const dbCon=require('./app/config/dbCon')
const cors=require('cors')
const path=require('path')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

const app = express();
dbCon()


//cose
app.use(cors())
//setup ejs as the template engine

app.use(cookieParser())

app.use(session({
    secret:"webskitters"||process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24
        
    }
}))

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(expressLayouts);
app.set("layout", "layouts/admin");
app.set("view engine", "ejs");
app.set('views','views')

//middleware use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create static folder
app.use(express.static('public'));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));
app.use('/uploads',express.static('uploads'));




const allRoute=require('./app/router/API/adminApiRoutes')
app.use('/api',allRoute)
const adminRoutes=require('./app/router/adminRoutes')
app.use('/admin',adminRoutes)
const userRoutes=require('./app/router/userRoutes')
app.use('/',userRoutes)




const PORT=process.env.PORT || 3006

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
})