import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Table, Tag, Button, message } from "antd";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faClock } from '@fortawesome/free-solid-svg-icons';

const GroomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      console.log("Fetching appointments...");
      const res = await axios.get("/api/v1/groomer/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Response:", res.data);
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Error fetching appointments");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const res = await axios.post(
        "/api/v1/groomer/update-appointment-status",
        {
          appointmentId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(`Appointment ${status}`);
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt._id === appointmentId ? { ...apt, status } : apt
          )
        );
      }
    } catch (error) {
      message.error("Error updating appointment status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'gold';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Pet Name",
      dataIndex: "petName",
    },
    {
      title: "Pet Type",
      dataIndex: "petType",
    },
    {
      title: "Services",
      dataIndex: "services",
      render: (services) => (
        <span>
          {services.map((service) => (
            <Tag color="blue" key={service}>
              {service}
            </Tag>
          ))}
        </span>
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
      title: "Notes",
      dataIndex: "notes",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="d-flex gap-2">
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                className="success-button"
                onClick={() => handleStatusUpdate(record._id, "approved")}
              >
                <FontAwesomeIcon icon={faCheck} /> Accept
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => handleStatusUpdate(record._id, "rejected")}
              >
                <FontAwesomeIcon icon={faTimes} /> Reject
              </Button>
            </>
          )}
          {record.status === "approved" && (
            <Button
              type="primary"
              onClick={() => handleStatusUpdate(record._id, "completed")}
            >
              <FontAwesomeIcon icon={faClock} /> Mark Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center mb-4">Manage Appointments</h2>
        <Table 
          columns={columns} 
          dataSource={appointments}
          rowKey="_id"
          className="appointment-table"
        />
      </div>
    </Layout>
  );
};

export default GroomerAppointments; 