const express=require('express');
const app=express();

require('dotenv').config();
require('./conn/conn');


const user=require('./routes/user');
const Books=require('./routes/book')
const Favourites=require('./routes/favourite')
const Cart=require('./routes/cart')
const Order=require('./routes/order')

app.use(express.json());

// routes
app.use('/api/v1',user)
app.use('/api/v1',Books)
app.use('/api/v1',Favourites)
app.use('/api/v1',Cart)
app.use('/api/v1',Order)








app.get('/fuck', (req, res) => {
    res.send('This is the /fuck route!');
});

app.listen(process.env.PORT,()=>{
    console.log(`server is  started at  ${process.env.PORT}`);
});