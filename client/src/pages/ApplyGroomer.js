import React from "react";
import { Col, Form, Input, Row, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faScissors } from '@fortawesome/free-solid-svg-icons';
import "../styles/ApplyGroomer.css";

const { Option } = Select;
const { TextArea } = Input;

// Constants for dropdowns
const SERVICES = [
  'Basic Grooming Package',
  'Full Grooming Package',
  'Bath & Brush',
  'Nail Trimming',
  'Ear Cleaning',
  'Teeth Brushing',
  'De-matting',
  'Flea Treatment',
  'Styling & Haircut',
  'Spa Treatment'
];

const PET_TYPES = [
  'Dogs - Small (0-15 lbs)',
  'Dogs - Medium (16-40 lbs)',
  'Dogs - Large (41-100 lbs)',
  'Dogs - Giant (100+ lbs)',
  'Cats - Short Hair',
  'Cats - Long Hair'
];

const ApplyGroomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      console.log('Sending data:', values);
      const res = await axios.post("/api/v1/user/apply-groomer", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log('Error details:', error.response || error);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="apply-groomer-container">
        <div className="form-header">
          <FontAwesomeIcon icon={faScissors} className="header-icon" />
          <h1>Apply as a Pet Groomer</h1>
          <p>Fill in your details to get started</p>
        </div>

        <Form layout="vertical" onFinish={handleFinish} className="groomer-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3><FontAwesomeIcon icon={faPaw} /> Basic Information</h3>
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="First Name" 
                  name="firstName" 
                  rules={[{ required: true, message: "Please input your first name!" }]}
                >
                  <Input placeholder="Your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Last Name" 
                  name="lastName" 
                  rules={[{ required: true, message: "Please input your last name!" }]}
                >
                  <Input placeholder="Your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Email" 
                  name="email" 
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: 'email', message: "Please enter a valid email!" }
                  ]}
                >
                  <Input type="email" placeholder="Your email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Password" 
                  name="password" 
                  rules={[
                    { required: true, message: "Please input your password!" },
                    { min: 6, message: "Password must be at least 6 characters" }
                  ]}
                >
                  <Input.Password placeholder="Create a password" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Phone" 
                  name="phone" 
                  rules={[
                    { required: true, message: "Please input your phone number!" },
                    { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number!" }
                  ]}
                >
                  <Input placeholder="Your phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="City" 
                  name="city" 
                  rules={[{ required: true, message: "Please input your city!" }]}
                >
                  <Input placeholder="Your city" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h3><FontAwesomeIcon icon={faPaw} /> Professional Details</h3>
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Years of Experience" 
                  name="experience" 
                  rules={[{ required: true, message: "Please input your experience!" }]}
                >
                  <Input type="number" min={0} placeholder="Years of experience" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Base Service Fee ($)" 
                  name="basePrice" 
                  rules={[{ required: true, message: "Please input your base fee!" }]}
                >
                  <Input type="number" min={0} placeholder="Base service fee" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Services Offered" 
                  name="services" 
                  rules={[{ required: true, message: "Please select your services!" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select services you offer"
                    allowClear
                  >
                    {SERVICES.map(service => (
                      <Option key={service} value={service}>{service}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Pet Types" 
                  name="petTypes" 
                  rules={[{ required: true, message: "Please select pet types!" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select pet types you work with"
                    allowClear
                  >
                    {PET_TYPES.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item 
                  label="About You" 
                  name="about"
                  rules={[{ required: true, message: "Please tell us about yourself!" }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Tell us about your experience and passion for pet grooming" 
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="submit-button-container">
            <button className="btn btn-primary" type="submit">
              <FontAwesomeIcon icon={faPaw} className="me-2" />
              Submit Application
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ApplyGroomer; 