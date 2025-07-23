import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from './components/Register'
import TicketList from './components/TicketList'
import TicketDetails from './components/TicketDetails'
import Login from './components/Login'
import WebhookLogs from './components/Webhook'
const App = () => {
  return (
   <div>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>} />
    <Route path='/register' element={<Register />}/>
    <Route path='/tickets' element={<TicketList/>}/>
    <Route path='/ticket/:id' element={<TicketDetails/>}/>
    <Route path = '/logs'element={<WebhookLogs/>}/>
   </Routes>
   </BrowserRouter> 
  
   </div>
  )
}

export default App