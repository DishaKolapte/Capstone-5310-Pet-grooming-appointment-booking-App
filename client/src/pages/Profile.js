import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { Col, Form, Input, Row, message, TimePicker } from "antd";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import "../styles/ProfileStyles.css";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  // Update profile information
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      console.log('Sending update request with values:', values);
      const res = await axios.post(
        "/api/v1/user/update-profile",
        {
          ...values,
          userId: user._id,
          ...(user.isGroomer && {
            timings: [
              moment(values.timings[0]).format("HH:mm"),
              moment(values.timings[1]).format("HH:mm"),
            ],
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log('Update profile error:', error);
      message.error("Something went wrong");
    }
  };

  // Update password
  const handlePasswordUpdate = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/update-password",
        {
          userId: user._id,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Password Updated Successfully");
        setIsPasswordModalVisible(false);
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        ...(user.isGroomer && {
          timings: [
            moment(user.timings[0], "HH:mm"),
            moment(user.timings[1], "HH:mm"),
          ],
        }),
      });
    }
  }, [user, form]);

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
          <h1>Profile Settings</h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="profile-form"
        >
          <div className="section">
            <h3>
              <FontAwesomeIcon icon={faUser} className="section-icon" />
              Personal Information
            </h3>
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please input your name!" }]}
                >
                  <Input prefix={<FontAwesomeIcon icon={faUser} />} placeholder="Your full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}
                >
                  <Input type="email" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please input your phone number!" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number!"
                    }
                  ]}
                >
                  <Input 
                    prefix={<FontAwesomeIcon icon="fa-solid fa-phone" />}
                    placeholder="Your phone number"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Address" 
                  name="address"
                  rules={[{ required: true, message: "Please input your address!" }]}
                >
                  <Input.TextArea 
                    placeholder="Your complete address"
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {user?.isGroomer && (
            <div className="section">
              <h3>
                <FontAwesomeIcon icon={faPaw} className="section-icon" />
                Grooming Services
              </h3>
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Services Offered"
                    name="services"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="e.g., Bath, Haircut, Nail Trimming" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Experience (Years)"
                    name="experience"
                    rules={[{ required: true }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Base Service Fee"
                    name="feesPerService"
                    rules={[{ required: true }]}
                  >
                    <Input type="number" prefix="$" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Working Hours" name="timings">
                    <TimePicker.RangePicker format="HH:mm" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          <div className="button-container">
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faPaw} className="me-2" />
              Update Profile
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setIsPasswordModalVisible(true)}
            >
              <FontAwesomeIcon icon={faLock} className="me-2" />
              Change Password
            </button>
          </div>
        </Form>

        {/* Password Update Modal */}
        {isPasswordModalVisible && (
          <div className="password-modal">
            <Form onFinish={handlePasswordUpdate} layout="vertical">
              <h3>Change Password</h3>
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <div className="button-container">
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPasswordModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile; 