const express = require('express');
const connectDB = require('./database')
const authRouter = require('./routes/authRoutes')
const connectionRouter = require('./routes/requestConnectionRoutes')
const connectionRoute = require('./routes/connectionRoute')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port =  process.env.PORT || 3300
const app = express();
app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',connectionRouter)
app.use('/',connectionRoute)
connectDB().then(() => {
    app.listen(port,() => {
        console.log('server started')
    })
}).catch((err) =>{
   console.log(err)
})
