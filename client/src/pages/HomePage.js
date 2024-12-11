import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Row, Col, Input, Select, Card, Rate, Button, Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faMapMarker, faDollarSign, faClock } from '@fortawesome/free-solid-svg-icons';
import "../styles/HomePage.css";

const { Search } = Input;
const { Option } = Select;

// Using the same constants from ApplyGroomer for consistency
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

const HomePage = () => {
  const [groomers, setGroomers] = useState([]);
  const [filteredGroomers, setFilteredGroomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  // Fetch all approved groomers
  const getGroomers = async () => {
    try {
      const res = await axios.get("https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/user/getAllGroomers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setGroomers(res.data.data);
        setFilteredGroomers(res.data.data);
        // Extract unique cities
        const uniqueCities = [...new Set(res.data.data.map(groomer => groomer.city))];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroomers();
  }, []);

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...groomers];

    // Text search
    if (searchText) {
      filtered = filtered.filter(groomer => 
        `${groomer.firstName} ${groomer.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
        groomer.about?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Services filter
    if (selectedServices.length > 0) {
      filtered = filtered.filter(groomer =>
        selectedServices.every(service => groomer.services.includes(service))
      );
    }

    // Pet types filter
    if (selectedPetTypes.length > 0) {
      filtered = filtered.filter(groomer =>
        selectedPetTypes.every(type => groomer.petTypes.includes(type))
      );
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(groomer => groomer.city === selectedCity);
    }

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter(groomer => {
        const price = Number(groomer.basePrice);
        switch(priceRange) {
          case 'low': return price <= 30;
          case 'medium': return price > 30 && price <= 60;
          case 'high': return price > 60;
          default: return true;
        }
      });
    }

    setFilteredGroomers(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedServices, selectedPetTypes, priceRange, selectedCity]);

  const handleBookAppointment = (groomerId) => {
    navigate(`/book-appointment/${groomerId}`);
  };

  return (
    <Layout>
      <div className="home-container">
        <div className="search-section">
          <h2><FontAwesomeIcon icon={faPaw} /> Find Your Perfect Pet Groomer</h2>
          
          <Row gutter={[16, 16]} className="search-filters">
            <Col xs={24} md={12} lg={6}>
              <Search
                placeholder="Search groomers..."
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </Col>
            
            <Col xs={24} md={12} lg={6}>
              <Select
                mode="multiple"
                placeholder="Select Services"
                onChange={setSelectedServices}
                maxTagCount="responsive"
                className="filter-select"
              >
                {SERVICES.map(service => (
                  <Option key={service} value={service}>{service}</Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Select
                mode="multiple"
                placeholder="Pet Types"
                onChange={setSelectedPetTypes}
                maxTagCount="responsive"
                className="filter-select"
              >
                {PET_TYPES.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Select
                placeholder="Select City"
                onChange={setSelectedCity}
                allowClear
                className="filter-select"
              >
                {cities.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Select
                placeholder="Price Range"
                onChange={setPriceRange}
                allowClear
                className="filter-select"
              >
                <Option value="low">$ Economy (≤$30)</Option>
                <Option value="medium">$$ Standard ($31-$60)</Option>
                <Option value="high">$$$ Premium (>$60)</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]} className="groomers-grid">
          {filteredGroomers.map((groomer) => (
            <Col xs={24} md={12} lg={8} key={groomer._id}>
              <Card className="groomer-card" hoverable>
                <h3>{groomer.firstName} {groomer.lastName}</h3>
                <div className="groomer-info">
                  <p>
                    <FontAwesomeIcon icon={faMapMarker} />
                    <span>{groomer.city}</span>
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faDollarSign} />
                    <span>Starting from ${groomer.basePrice}</span>
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{groomer.experience} years experience</span>
                  </p>
                </div>

                <div className="services-tags">
                  {groomer.services.slice(0, 3).map((service, index) => (
                    <Tag key={index} color="blue">{service}</Tag>
                  ))}
                  {groomer.services.length > 3 && (
                    <Tag color="blue">+{groomer.services.length - 3} more</Tag>
                  )}
                </div>

                <div className="pet-types-tags">
                  {groomer.petTypes.map((type, index) => (
                    <Tag key={index} color="green">{type}</Tag>
                  ))}
                </div>

                <p className="groomer-about">{groomer.about}</p>

                <Button 
                  type="primary" 
                  block 
                  onClick={() => handleBookAppointment(groomer._id)}
                  className="book-button"
                >
                  Book Appointment
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  );
};

export default HomePage;