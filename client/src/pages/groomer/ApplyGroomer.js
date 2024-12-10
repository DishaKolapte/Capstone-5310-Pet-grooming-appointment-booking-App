import React from "react";
import Layout from "../../components/Layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

const ApplyGroomer = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-groomer",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
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
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="apply-groomer-container">
        <div className="form-header">
          <FontAwesomeIcon icon={faPaw} className="paw-icon" />
          <h1>Apply as a Groomer</h1>
          <p>Fill in your professional details</p>
        </div>
        
        <Form layout="vertical" onFinish={handleFinish} className="groomer-form">
          <h4>Personal Details</h4>
          <Row gutter={20}>
            {/* ... existing form fields ... */}
          </Row>
          <h4>Professional Details</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Services Offered"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="e.g., Bath, Haircut, Nail Trimming" />
              </Form.Item>
            </Col>
           
          </Row>
          <div className="submit-button-container">
            <button className="btn btn-primary" type="submit">
              <FontAwesomeIcon icon={faPaw} className="me-2" />
              Submit Application
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default ApplyGroomer; 