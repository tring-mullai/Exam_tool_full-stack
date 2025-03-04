import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Frontend/components/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Frontend/components/Login'
import Signup from './Frontend/components/Signup'



const App = () => {
  return (
      
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>

    
     
      
    
    
  )
}

export default App
