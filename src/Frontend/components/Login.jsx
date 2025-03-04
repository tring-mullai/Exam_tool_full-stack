import React ,{useContext} from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';
import login_img from '../../assets/login_background.png'
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { ToastContainer,toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from './context/AuthContext'

const schema = yup.object().shape(
  {
    email: yup.string().email("Invalid email Format").required("Email is required"),
    password: yup.string().min(6,"length must be of 6").matches(/[0-9]/,"password must contain atleast one number").required('password is required')
  }
);


const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
      register,
      handleSubmit,
      formState:{errors},    
    } = useForm({resolver:yupResolver(schema)});


    const onSubmit = (data) => {
    login(data); 
    toast.success("Login successful!");
    
    // setTimeout(() => {
    //   navigate("/dashboard"); 
    // }, 1500);
  };

  return (
    <div  className='d-flex flex-row '>
    
    <div>
      <img src={login_img} alt='not displayed' style={{height:'100vh', width:'90%'}}/>
    </div>
    <div>
    <Container className='d-flex justify-content-center align-items-center vh-100'>

      <Card className='p-4 shadow' style={{ width: '400px' }}>
        <h3 className='text-center mb-3'>Login</h3>

    <Form onSubmit={handleSubmit(onSubmit)}>

      <Form.Group className='mb-3'>
        <Form.Label>Email <sup className='text-danger'>*</sup></Form.Label>
        <Form.Control type='email' {...register("email")} placeholder='Enter email'/>
        {errors.email && <small className='text-danger'>{errors.email.message}</small>}
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Password <sup className='text-danger'>*</sup></Form.Label>
        <Form.Control type='password' {...register("password")} placeholder='Enter password'/>
        {errors.password && <small className='text-danger'>{errors.password.message}</small>}
      </Form.Group>

      <Button type='submit' variant='primary' className='w-100 btn-lg'>Submit</Button>
    </Form>
     
     <p className='text-center mt-3'>Don't have an account?</p>
     <Link to="/signup">
     <Button type='button' variant='success' style={{marginLeft:"120px"}}>Sign Up</Button>
     </Link>
    </Card>

    <ToastContainer position='top-right' autoClose={3000}/>
    </Container>
    </div>
    </div>

  
  );
};

export default Login
