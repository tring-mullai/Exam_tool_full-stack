import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import header_logo from '../../../assets/header_logo.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentExam, setCurrentExam] = useState({ id: null, title: '', description: '', duration: '' });
  const navigate = useNavigate();
  

  useEffect(() => {

    fetchExams();
  }, [navigate]);

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/route/exams');
      setExams(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
      console.error("Fetch Exams Error:", error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCurrentExam({ ...currentExam, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentExam.id) {
        await axios.put(`http://localhost:5000/api/route/exams/${currentExam.id}`, currentExam);
        toast.success('Exam updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/route/exams', currentExam);
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      fetchExams();
    } catch (error) {
      toast.error('Failed to save exam');
    }
  };

  const handleEdit = (exam) => {
    setCurrentExam(exam);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/route/exams/${id}`);
      toast.success('Exam deleted successfully');
      fetchExams();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const handleStartExam = (examId) => {
    toast.info(`Starting exam with ID: ${examId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate('/login');
  };

  return (
    <Container fluid className="p-0 h-100">
      <Row className="m-0 h-100 ">
        
        <Col md={3} className="sidebar p-0 shadow-sm ">
          <div className="d-flex flex-column h-100 bg-white bg-dark">
            
            <div className="p-4 border-bottom">
              <img 
                src={header_logo} 
                alt="not_displayed" 
                className="img-fluid" 
                style={{ maxWidth: '150px' }} />
            </div>
            
            
            <div className="p-4 ">
              <h6 className="text-uppercase text-muted mb-4 small">Main Menu</h6>
              <ul className="nav flex-column">
              <li className="nav-item mb-2">

                <button 
                    className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "Home" ? 'bg-secondary text-white' : ''}`}
                    onClick={() => setActiveTab("Home")}>
                Home
                </button>

              </li>
              
                <li className="nav-item mb-2">

                  <button 
                    className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "List Exams" ? 'bg-secondary text-white' : ''}`}
                    onClick={() => setActiveTab("List Exams")}>
                  List Exams
                  </button>

                </li>

                <li className="nav-item mb-2">

                  <button 
                    className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "Create Exam" ? 'bg-secondary text-white' : ''}`}
                    onClick={() => setActiveTab("Create Exam")}>
                  Create Exam
                  </button>

                </li>

                <li className="nav-item mb-2">

                  <button 
                    className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "Scores" ? 'bg-secondary text-white' : ''}`}
                    onClick={() => setActiveTab("Scores")}>
                  Scores
                  </button>

                </li>
              </ul>
            </div>
            
            
            <div className="mt-auto border-top p-4">

              <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger w-100">
                Logout
              </button>

            </div>
          </div>
        </Col>
        
        
        <Col md={9} className="main-content p-4">
          <h4 className="text-primary mb-3">Welcome </h4>
          <h2>Hello Username</h2>
          <div className="bg-light p-4 rounded-3 shadow-sm mt-4">
            {activeTab === "List Exams" && (
              <>
                <h5>List of Exams</h5>
                <div>
                  {exams.map((exam) => (
                    <Card key={exam.id} className="mb-3">
                      <Card.Body>
                        <Card.Title>{exam.title}</Card.Title>
                        <Card.Text>{exam.description}</Card.Text>
                        <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                        {activeTab === "List Exams" ? (
                          <Button variant="success" onClick={() => handleStartExam(exam.id)}>Start Exam</Button>
                        ) : (
                          <>
                            <Button variant="warning" onClick={() => handleEdit(exam)}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDelete(exam.id)}>Delete</Button>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {activeTab === "Create Exam" && (
              <>
                <h5>Create an Exam</h5>
                <Button variant="primary" onClick={() => setShowModal(true)}>Create Exam</Button>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>{currentExam.id ? 'Edit Exam' : 'Create Exam'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={currentExam.title} onChange={handleInput} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={currentExam.description} onChange={handleInput} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration (minutes)</Form.Label>
                        <Form.Control type="number" name="duration" value={currentExam.duration} onChange={handleInput} required />
                      </Form.Group>
                      <Button variant="primary" type="submit">Save</Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </>
            )}

            {activeTab === "Scores" && <h5>Exam Scores</h5>}
          </div>
        </Col>

      </Row>
      <ToastContainer />
    </Container>
  );
};

export default MainDashboard;
 