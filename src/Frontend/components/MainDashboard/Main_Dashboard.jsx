import React, { useState, useEffect, act } from 'react';
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
  const [currentExam, setCurrentExam] = useState({ id: null, title: '', description: '', duration: '', questions: [] });
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchExams();  
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/route/exams', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExams(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
      // console.error("Fetch Exams Error:", error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCurrentExam({ ...currentExam, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate questions
    const validQuestions = currentExam.questions.filter(q => 
      q.text && q.options && q.options.length >= 2 && q.correct_answer !== null
    );
    
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question with options and mark a correct answer');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
  
      // Format exam data
      const examData = {
        ...currentExam,
        questions: validQuestions
      };
  
      if (currentExam.id) {
        await axios.put(`http://localhost:5000/api/route/exams/${currentExam.id}`, examData, { headers });
        toast.success('Exam updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/route/exams', examData, { headers });
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      fetchExams();
      // Reset current exam
      setCurrentExam({ id: null, title: '', description: '', duration: '', questions: [] });
    } catch (error) {
      toast.error('Failed to save exam');
      console.error("Save Exam Error:", error);
    }
  };
  
  const handleEdit = (exam) => {
    // Create a copy of the exam object
    let examToEdit = { ...exam };
    
    // Handle questions that might be stored as a JSON string
    if (examToEdit.questions && typeof examToEdit.questions === 'string') {
      try {
        examToEdit.questions = JSON.parse(examToEdit.questions);
      } catch (error) {
        console.error("Error parsing questions JSON:", error);
        examToEdit.questions = [];
      }
    } else if (!Array.isArray(examToEdit.questions)) {
      // Ensure questions is an array
      examToEdit.questions = [];
    }
    
    // Set the current exam and open the modal
    setCurrentExam(examToEdit);
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/route/exams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Exam deleted successfully');
      fetchExams();
    } catch (error) {
      toast.error('Failed to delete exam');
      console.error("Delete Exam Error:", error);
    }
  };

  const handleStartExam = (examId) => {
    toast.info(`Starting exam with ID: ${examId}`);
    // You can navigate to exam page here
    // navigate(`/take-exam/${examId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    navigate('/login');
    toast.info('Logged out successfully');
  };

 return(
  <Container fluid className="p-0 h-100">
  <Row className="m-0 h-100 ">
    
    <Col md={3} className="sidebar p-0 shadow-sm ">
      <div className="d-flex flex-column h-100 bg-white">
        
        <div className="p-4 border-bottom">
          <img 
            src={header_logo} 
            alt="Logo" 
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
      <h2>Hello User</h2>
      <div className="bg-light p-4 rounded-3 shadow-sm mt-4">
        {activeTab === "Home" && (
          <div>
            <h5>Dashboard Overview</h5>
            <p>Welcome to your exam dashboard. Use the sidebar to navigate through different sections.</p>
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <Card.Title>{exams.length}</Card.Title>
                    <Card.Text>Total Exams</Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <Card.Title>0</Card.Title>
                    <Card.Text>Completed Exams</Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <Card.Title>0</Card.Title>
                    <Card.Text>Average Score</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "List Exams" && (
          <>
            <h5>List of Exams</h5>
            <div>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <Card key={exam.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>{exam.title}</Card.Title>
                      <Card.Text>{exam.description}</Card.Text>
                      <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                      
                       <Card.Text>Questions: {exam.questions ? exam.questions.length : 0}</Card.Text>

                      <Button variant="success" onClick={() => handleStartExam(exam.id)}>Start Exam</Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No exams found. Create an exam to get started.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "Create Exam" && (
          <>
            <h5>Manage Exams</h5>
            <Button variant="primary" onClick={() => {
              setCurrentExam({ id: null, title: '', description: '', duration: '', questions: [] });
              setShowModal(true);
            }}>Create New Exam</Button>
            
            <div className="mt-4">
              <h6>Your Exams:</h6>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <Card key={exam.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>{exam.title}</Card.Title>
                      <Card.Text>{exam.description}</Card.Text>
                      <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                     
                      <Card.Text>Questions: {exam.questions ? exam.questions.length : 0}</Card.Text>

                      <Button variant="warning" className="me-2" onClick={() => handleEdit(exam)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(exam.id)}>Delete</Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No exams found. Create an exam to get started.</p>
              )}
            </div>
            
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
                  <Form.Group className="mb-3">
                    <Form.Label>Questions</Form.Label>
                    <div className="mb-2">
                    {currentExam.questions.map((question, qIndex) => (
                    <Card className="mb-3" key={qIndex}>
                    <Card.Body>
                    <Form.Group className="mb-2">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control 
                    type="text" 
                    value={question.text || ''} 
                    onChange={(e) => {
                    const updatedQuestions = [...currentExam.questions];
                    updatedQuestions[qIndex].text = e.target.value;
                    setCurrentExam({...currentExam, questions: updatedQuestions});
                      }}
                     required 
                    />
                  </Form.Group>
      
      <Form.Group className="mb-2">
        <Form.Label>Options</Form.Label>
        {(question.options || []).map((option, oIndex) => (
          <div className="d-flex mb-2" key={oIndex}>
            <Form.Control 
              type="text" 
              value={option} 
              onChange={(e) => {
                const updatedQuestions = [...currentExam.questions];
                updatedQuestions[qIndex].options[oIndex] = e.target.value;
                setCurrentExam({...currentExam, questions: updatedQuestions});
              }}
            />
            <Form.Check 
              type="radio" 
              className="ms-2 mt-2" 
              checked={question.correct_answer === oIndex}
              onChange={() => {
                const updatedQuestions = [...currentExam.questions];
                updatedQuestions[qIndex].correct_answer = oIndex;
                setCurrentExam({...currentExam, questions: updatedQuestions});
              }}
              label="Correct"
            />
            <Button 
              variant="danger" 
              size="sm" 
              className="ms-2"
              onClick={() => {
                const updatedQuestions = [...currentExam.questions];
                updatedQuestions[qIndex].options.splice(oIndex, 1);
                if (question.correct_answer === oIndex) {
                  updatedQuestions[qIndex].correct_answer = null;
                }
                setCurrentExam({...currentExam, questions: updatedQuestions});
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => {
            const updatedQuestions = [...currentExam.questions];
            if (!updatedQuestions[qIndex].options) {
              updatedQuestions[qIndex].options = [];
            }
            updatedQuestions[qIndex].options.push('');
            setCurrentExam({...currentExam, questions: updatedQuestions});
          }}
        >
          Add Option
        </Button>
      </Form.Group>
      
      <Button 
        variant="danger" 
        size="sm"
        onClick={() => {
          const updatedQuestions = [...currentExam.questions];
          updatedQuestions.splice(qIndex, 1);
          setCurrentExam({...currentExam, questions: updatedQuestions});
        }}
      >
        Remove Question
      </Button>
      </Card.Body>
      </Card>
         ))}
       </div>
      <Button 
      variant="secondary"
      onClick={() => {
      const updatedQuestions = [...currentExam.questions];
      updatedQuestions.push({
      text: '',
      options: ['', ''],
      correct_answer: null
    });
     setCurrentExam({...currentExam, questions: updatedQuestions});
   }}
    >
       Add Question
      </Button>
       </Form.Group>
                  <Button variant="primary" type="submit">Save</Button>
                  <Button variant="secondary" className="ms-2" onClick={() => setShowModal(false)}>Cancel</Button>
                </Form>
              </Modal.Body>
            </Modal>
          </>
        )}

        {activeTab === "Scores" && (
          <>
            <h5>Exam Scores</h5>
            <p>No exam attempts found. Start an exam to see your scores here.</p>
          </>
        )}
      </div>
    </Col>
  </Row>
  <ToastContainer />
</Container>
 );
};

export default MainDashboard;