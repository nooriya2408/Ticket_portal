const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB= require('./config/db')
//const authRoutes = require('./routes/auth.js');
const authRoutes = require('./routes/auth')
//app.use('/api/auth',authRoutes)
//const formRoutes = require('./routes/form')
//const User = require('./models/User');
const hubspot = require('./routes/hubspot')
const Freshdesk = require('./routes/freshdesk')
const webhookRoute = require('./routes/freshdeskWebhook')
const webhook = require('./routes/webhook')
const webhooklogs = require('./routes/webhooks')
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://ticket-portal-jet.vercel.app", // 👈 Add your deployed frontend URL here
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth',authRoutes)
//app.use('/api/form',formRoutes)
app.use('/hubspot',hubspot)
app.use('/freshdesks',Freshdesk)
app.use('/freshdesk',webhookRoute)
app.use('/webhook',webhook)
app.use('/webhooks',webhooklogs)
app.get('/',(req,res)=>{
    res.send('backend server is running....')
})

app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`)
})
