import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Form, Input, Select, Button, message, Row, Col, Card, Modal, Spin } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faUser, faMoneyBill, faInfoCircle, faKey } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;
const { TextArea } = Input;

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

const GroomerProfile = () => {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Redirect if not logged in or not a groomer
    if (!user) {
      message.error("Please login to access this page");
      navigate("/login");
      return;
    }

    if (!user.isGroomer) {
      message.error("Unauthorized access");
      navigate("/");
      return;
    }

    getGroomerProfile();
  }, [user, navigate]);

  const getGroomerProfile = async () => {
    if (!user?._id) return;

    try {
      const res = await axios.post('/api/v1/groomer/getGroomerInfo', {
        userId: user._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        const groomerData = res.data.data;
        form.setFieldsValue(groomerData);
        setProfileData(groomerData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post('/api/v1/groomer/updateProfile', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        message.success('Profile updated successfully');
        setProfileData(res.data.data);
        form.setFieldsValue(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Error updating profile');
    }
  };

  const handlePasswordUpdate = async (values) => {
    try {
      const res = await axios.post('/api/v1/user/update-password', {
        userId: user._id,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        message.success('Password updated successfully');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Error updating password');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Spin size="large" tip="Loading profile..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center mb-4">
          <FontAwesomeIcon icon={faPaw} className="me-2" />
          Groomer Profile
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="profile-form"
        >
          {/* Basic Information */}
          <Card title={<><FontAwesomeIcon icon={faUser} className="me-2" />Basic Information</>} className="mb-4">
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item label="First Name" name="firstName">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Last Name" name="lastName">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email">
                  <Input disabled />
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
                  <Input placeholder="Your contact number" />
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
          </Card>

          {/* Professional Information */}
          <Card title={<><FontAwesomeIcon icon={faInfoCircle} className="me-2" />Professional Details</>} className="mb-4">
            <Row gutter={20}>
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
                  <Input 
                    type="number" 
                    min={0} 
                    prefix={<FontAwesomeIcon icon={faMoneyBill} />} 
                    placeholder="Base service fee" 
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* About */}
          <Card title={<><FontAwesomeIcon icon={faInfoCircle} className="me-2" />Additional Information</>}>
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
          </Card>

          <div className="text-end mt-4">
            <Button 
              type="default" 
              onClick={() => setPasswordModalVisible(true)} 
              className="me-3"
            >
              <FontAwesomeIcon icon={faKey} className="me-2" />
              Change Password
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              <FontAwesomeIcon icon={faPaw} className="me-2" />
              Update Profile
            </Button>
          </div>
        </Form>

        {/* Password Update Modal */}
        <Modal
          title={<><FontAwesomeIcon icon={faKey} className="me-2" />Update Password</>}
          visible={passwordModalVisible}
          onCancel={() => {
            setPasswordModalVisible(false);
            passwordForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordUpdate}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className="text-end mb-0">
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default GroomerProfile; 