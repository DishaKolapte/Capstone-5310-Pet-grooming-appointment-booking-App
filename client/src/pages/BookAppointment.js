import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker, Form, Input, Select, Button, message, Card } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPaw } from '@fortawesome/free-solid-svg-icons';
import "../styles/BookAppointment.css";

const { Option } = Select;
const { TextArea } = Input;

const BookAppointment = () => {
  const { groomerId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const [groomer, setGroomer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) {
      message.error("Please login to book an appointment");
      navigate("/login");
      return;
    }
    getGroomerDetails();
  }, [user, navigate]);

  const getGroomerDetails = async () => {
    try {
      const res = await axios.get(`/api/v1/groomer/getGroomerById/${groomerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setGroomer(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching groomer details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(
        "https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/user/book-appointment",
        {
          ...values,
          groomerId,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        navigate('/appointments');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      message.error("Error booking appointment");
    }
  };

  return (
    <Layout>
      <div className="booking-container">
        <h2 className="text-center mb-4">Book an Appointment</h2>
        {groomer && (
          <Card className="groomer-info-card">
            <h3>{groomer.firstName} {groomer.lastName}</h3>
            <p>Services: {groomer.services?.join(", ") || "No services listed"}</p>
            <p>Working Days: {groomer.workingDays?.join(", ") || "No working days specified"}</p>
            <p>Base Price: ${groomer.basePrice}</p>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="row">
            <div className="col-md-6">
              <Card title="Appointment Details" className="appointment-details">
                <Form.Item
                  label="Pet Name"
                  name="petName"
                  rules={[{ required: true, message: "Please enter your pet's name" }]}
                >
                  <Input prefix={<FontAwesomeIcon icon={faPaw} />} placeholder="Your pet's name" />
                </Form.Item>

                <Form.Item
                  label="Pet Type"
                  name="petType"
                  rules={[{ required: true, message: "Please select your pet type" }]}
                >
                  <Select placeholder="Select pet type">
                    {groomer?.petTypes?.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    )) || []}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Services Required"
                  name="services"
                  rules={[{ required: true, message: "Please select at least one service" }]}
                >
                  <Select mode="multiple" placeholder="Select services">
                    {groomer?.services?.map(service => (
                      <Option key={service} value={service}>{service}</Option>
                    )) || []}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Preferred Date"
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker 
                    className="w-100" 
                    format="YYYY-MM-DD"
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day');
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Preferred Time"
                  name="time"
                  rules={[{ required: true, message: "Please select a time" }]}
                >
                  <DatePicker.TimePicker 
                    format="HH:mm"
                    className="w-100"
                    minuteStep={30}
                  />
                </Form.Item>

                <Form.Item
                  label="Special Instructions"
                  name="notes"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Any special instructions or notes for the groomer" 
                  />
                </Form.Item>

                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block
                >
                  <FontAwesomeIcon icon={faPaw} className="me-2" />
                  Request Appointment
                </Button>
              </Card>
            </div>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default BookAppointment; 