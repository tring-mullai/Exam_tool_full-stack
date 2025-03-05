import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Frontend/components/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Frontend/components/Login'
import Signup from './Frontend/components/Signup'
import ProtectedRoute from './Frontend/components/ProtectedRoute';
import Student_Dashboard from './Frontend/components/Student_Dashboard/Student_Dashboard';
import Exam_creator from './Frontend/components/Exam_creator/Exam_creator';



const App = () => {
  return (
      
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>

      <Route path='/student_dashboard' element={<ProtectedRoute><Student_Dashboard/></ProtectedRoute>}/>
      <Route path='/exam_creator' element={<ProtectedRoute><Exam_creator/></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>

    
     
      
    
    
  )
}

export default App
