import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Table, Tag, Button, Modal, DatePicker, TimePicker, message, Card } from "antd";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faTimes, faRedo } from '@fortawesome/free-solid-svg-icons';
import "../styles/AppointmentStyles.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState(null);

  const getAppointments = async () => {
    try {
      const res = await axios.get("https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/user/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      message.error("Error fetching appointments");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      const res = await axios.post(
        "/api/v1/user/cancel-appointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success("Appointment cancelled successfully");
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt._id === appointmentId ? { ...apt, status: "cancelled" } : apt
          )
        );
      }
    } catch (error) {
      message.error("Error cancelling appointment");
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      message.error("Please select both date and time");
      return;
    }

    try {
      const res = await axios.post(
        "/api/v1/user/reschedule-appointment",
        {
          appointmentId: selectedAppointment._id,
          date: newDate.format("YYYY-MM-DD"),
          time: newTime.format("HH:mm"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success("Reschedule request sent successfully");
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt._id === selectedAppointment._id 
              ? { 
                  ...apt, 
                  status: "pending",
                  date: newDate.format("YYYY-MM-DD"),
                  time: newTime.format("HH:mm")
                } 
              : apt
          )
        );
        setRescheduleModal(false);
        setSelectedAppointment(null);
        setNewDate(null);
        setNewTime(null);
      }
    } catch (error) {
      message.error("Error rescheduling appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'gold';
      case 'approved':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      case 'rescheduled':
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      responsive: ['md'],
    },
    {
      title: "Time",
      dataIndex: "time",
      responsive: ['md'],
    },
    {
      title: "Groomer & Details",
      render: (record) => (
        <div className="appointment-details-cell">
          <div className="groomer-name">
            {record.groomerId?.firstName} {record.groomerId?.lastName}
          </div>
          <div className="mobile-date-time">
            {moment(record.date).format("DD-MM-YYYY")} at {record.time}
          </div>
          <div className="pet-details">
            {record.petName} ({record.petType})
          </div>
        </div>
      ),
      responsive: ['xs'],
    },
    {
      title: "Pet Name",
      dataIndex: "petName",
      responsive: ['md'],
    },
    {
      title: "Services",
      dataIndex: "services",
      render: (services) => (
        <div className="services-tags">
          {services.map((service) => (
            <Tag color="blue" key={service}>
              {service}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="action-buttons">
          {record.status === "approved" && (
            <>
              <Button
                type="primary"
                danger
                block
                onClick={() => handleCancel(record._id)}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </Button>
              <Button
                type="primary"
                block
                onClick={() => {
                  setSelectedAppointment(record);
                  setRescheduleModal(true);
                }}
              >
                <FontAwesomeIcon icon={faRedo} /> Reschedule
              </Button>
            </>
          )}
        </div>
      ),
      width: 200,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  return (
    <Layout>
      <div className="appointments-container">
        <Card className="appointments-card">
          <h2 className="page-title">My Appointments</h2>
          <Table 
            columns={columns} 
            dataSource={appointments}
            rowKey="_id"
            className="appointment-table"
            scroll={{ x: true }}
          />
        </Card>

        <Modal
          title={
            <div className="modal-title">
              <FontAwesomeIcon icon={faCalendarAlt} className="modal-icon" />
              Reschedule Appointment
            </div>
          }
          visible={rescheduleModal}
          onOk={handleReschedule}
          onCancel={() => {
            setRescheduleModal(false);
            setSelectedAppointment(null);
            setNewDate(null);
            setNewTime(null);
          }}
          className="reschedule-modal"
          okButtonProps={{ block: true }}
          cancelButtonProps={{ block: true }}
          okText="Confirm Reschedule"
          cancelText="Cancel"
        >
          <div className="reschedule-form">
            <div className="form-group">
              <label>Select New Date</label>
              <DatePicker
                className="w-100"
                value={newDate}
                onChange={setNewDate}
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
              />
            </div>
            <div className="form-group">
              <label>Select New Time</label>
              <TimePicker
                className="w-100"
                format="HH:mm"
                minuteStep={30}
                value={newTime}
                onChange={setNewTime}
              />
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Appointments;