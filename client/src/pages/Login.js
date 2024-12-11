import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/user/login", values);
      dispatch(hideLoading());

      if (res.data.success) {
        // Store token and user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        message.success(res.data.message);
        
        // Redirect based on user role
        if (res.data.user.isAdmin) {
          navigate("/admin/users");
        } else if (res.data.user.isGroomer) {
          navigate("/groomer/profile");
        } else {
          navigate("/");
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Login error:', error);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="register-form"
        >
          <div className="form-title">
            <FontAwesomeIcon icon={faPaw} className="paw-icon" />
            <h3>Welcome to Pet Grooming</h3>
            <p>Login to manage your appointments</p>
          </div>

          <Form.Item 
            label="Email" 
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item 
            label="Password" 
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <div className="register-links">
            <p>New to Pet Grooming?</p>
            <div className="d-flex flex-column align-items-center">
              <Link to="/register">
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Register as Pet Owner
              </Link>
              <Link to="/apply-groomer">
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Apply as Groomer
              </Link>
            </div>
          </div>

          <button className="btn btn-primary" type="submit">
            <FontAwesomeIcon icon={faPaw} className="me-2" />
            Login
          </button>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default Login;