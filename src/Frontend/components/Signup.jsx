import React ,{useContext} from 'react'
import { Container,Form,Button,Card } from 'react-bootstrap'
import {Link,useNavigate} from 'react-router-dom'
import Signup_background from '../../assets/signup_background.jpg'
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { ToastContainer,toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from './context/AuthContext'



const schema = yup.object().shape(
  {
    name: yup.string().min(3,"Name must be at 3 Characters").required("Name is required"),
    email: yup.string().email("Invalid email Format").required("Email is required"),
    role: yup.string().oneOf(['Student','exam_creator'],"select a valid role").required("Role is required"),
    password: yup.string().min(6,"length must be of 6").matches(/[0-9]/,"password must contain atleast one number").required('password is required'),
    confirmPassword: yup.string().oneOf([yup.ref("password")],"Password doesn't match").required("Confirm password is required")
  }
);
const Signup = () => {
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState:{errors},    
  } = useForm({resolver:yupResolver(schema)});
  
  const onSubmit = (data) =>
  {
    delete data.confirmPassword;
    login(data);
    toast.success("Signup Successful");

    setTimeout(() =>
    {
       navigate('/login');
    },1500);
  };
  return (
    <div className='d-flex flex-row'>

      
    <Container className='d-flex justify-content-center align-items-center vh-100'>
      <Card className='p-4 shadow' style={{width:"500px"}}>
        <h3 className='mb-3 text-center'>Sign Up</h3>

        <Form onSubmit={handleSubmit(onSubmit)}>

          <Form.Group className='mb-3'>
            <Form.Label>Name <sup className='text-danger'>*</sup></Form.Label>
            <Form.Control type='name' {...register("name")} placeholder='Enter name'/>
            {errors.name && <small className='text-danger'>{errors.name.message}</small>}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Email <sup className='text-danger'>*</sup></Form.Label>
            <Form.Control type='email' {...register("email")} placeholder='Enter email'/>
            {errors.email && <small className='text-danger'>{errors.email.message}</small>}
          </Form.Group>

          <Form.Group className='mb-3'>
             <Form.Label>Choose Role <sup className='text-danger'>*</sup></Form.Label>
             <Form.Select {...register('role')}>
              <option value="">Choose role</option>
              <option value="Student">Student</option>
              <option value="exam_creator">Exam creator</option>
             </Form.Select>
             {errors.role && <small className='text-danger'>{errors.role.message}</small>}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Password <sup className='text-danger'>*</sup></Form.Label>
            <Form.Control type='password' {...register('password')} placeholder='Enter password'/>
            {errors.password && <small className='text-danger'>{errors.password.message}</small>}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Confirm Passsword <sup className='text-danger'>*</sup></Form.Label>
            <Form.Control type='password' {...register('confirmPassword')} placeholder='Confirm password'/>
            {errors.confirmPassword && <small className='text-danger'>{errors.confirmPassword.message}</small>}
          </Form.Group>

          <Button type='Submit' variant='primary' className='w-100 btn-lg'>Submit</Button>
        </Form>

        <p className='mt-3 mb-3 text-center'>Already have an account?</p>
        <Link to="/login">
        <Button type='button' variant='success' style={{marginLeft:"180px"}}>Login</Button>
        </Link>
      </Card>

      <ToastContainer position='top-left' autoClose={3000}/>
    </Container>
    <div>
        <img src={Signup_background} alt='not_displayed' style={{height:'100vh'}}/>
      </div>

    </div>
  );
};

export default Signup
