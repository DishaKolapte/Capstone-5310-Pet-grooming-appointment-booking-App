import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Table, Tag, Button, message, Modal, Card, Row, Col, Statistic } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan, faUndo } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const Groomers = () => {
  const [groomers, setGroomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    groomer: null,
    action: null
  });

  const getGroomers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        return;
      }

      const res = await axios.get("https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/admin/getAllGroomers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setGroomers(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Access denied. Admin only.");
      } else {
        message.error("Error fetching groomers");
      }
    }
  };

  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/admin/groomer-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Access denied. Admin only.");
      } else {
        message.error("Error fetching statistics");
      }
    }
  };

  useEffect(() => {
    Promise.all([getGroomers(), getStats()])
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (groomerId, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeGroomerStatus",
        { groomerId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(`Groomer ${status} successfully`);
        getGroomers();
        getStats();
      }
    } catch (error) {
      console.error("Error changing status:", error);
      message.error("Error changing groomer status");
    }
    setConfirmModal({ visible: false, groomer: null, action: null });
  };

  const showConfirmModal = (groomer, action) => {
    setConfirmModal({
      visible: true,
      groomer,
      action
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: "Name",
      render: (text, record) => (
        <span>{record.firstName} {record.lastName}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY"),
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
      render: (text, record) => (
        <div className="action-buttons">
          {record.status === "pending" && (
            <Button
              type="primary"
              onClick={() => showConfirmModal(record, 'approve')}
            >
              <FontAwesomeIcon icon={faCheck} /> Approve
            </Button>
          )}
          {record.status !== "blocked" && (
            <Button
              type="primary"
              danger
              onClick={() => showConfirmModal(record, 'block')}
            >
              <FontAwesomeIcon icon={faBan} /> Block
            </Button>
          )}
          {record.status === "blocked" && (
            <Button
              type="default"
              onClick={() => showConfirmModal(record, 'unblock')}
            >
              <FontAwesomeIcon icon={faUndo} /> Unblock
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="admin-container">
        <h1>Groomer Management</h1>
        
        <Row gutter={16} className="stats-cards">
          <Col span={6}>
            <Card>
              <Statistic title="Total Groomers" value={stats.total || 0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Approved" 
                value={stats.approved || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Pending" 
                value={stats.pending || 0}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Blocked" 
                value={stats.blocked || 0}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={groomers}
          rowKey="_id"
        />

        <Modal
          title={`Confirm ${confirmModal.action?.charAt(0).toUpperCase() + confirmModal.action?.slice(1)}`}
          visible={confirmModal.visible}
          onOk={() => handleStatusChange(
            confirmModal.groomer?._id,
            confirmModal.action === 'approve' ? 'approved' :
            confirmModal.action === 'block' ? 'blocked' : 'pending'
          )}
          onCancel={() => setConfirmModal({ visible: false, groomer: null, action: null })}
          okText={confirmModal.action?.charAt(0).toUpperCase() + confirmModal.action?.slice(1)}
          cancelText="Cancel"
        >
          <p>Are you sure you want to {confirmModal.action} {confirmModal.groomer?.firstName} {confirmModal.groomer?.lastName}?</p>
          {confirmModal.action === 'block' && (
            <p style={{ color: '#ff4d4f' }}>This will prevent the groomer from accessing their account.</p>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Groomers;