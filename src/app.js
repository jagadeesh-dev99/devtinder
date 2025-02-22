import express from 'express';

const app = express()


app.use('/' , (req,res) => {
    res.end('hello world')
})

app.use('/test' , (req,res) => {
    res.send('hello world testing ujrl')
})

app.listen(3000,() => {
    console.log('server started....')
})