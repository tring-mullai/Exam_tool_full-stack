import React, { useState, useEffect } from 'react';
import './Navbar.css';
import header_logo from '../../../assets/header_logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true, // Ensures cookies are sent with the request
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Ensure user state is cleared on error
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className='header'>
      <img src={header_logo} alt='not_displayed' className='header_logo' />
      <ul className='header_buttons'>
        {user ? (
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {user.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <>
            <li><Link to="/login" className='head-btn'>Login</Link></li>
            <li><Link to="/signup" className='head-btn'>Sign Up</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;

