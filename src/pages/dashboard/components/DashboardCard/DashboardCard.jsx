import React from "react";
import { Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./DashboardCard.scss";

const DashboardCard = ({ title, icon: Icon, path, onClick, type }) => {
  return (
    <Col xs={6} md={4} lg={3} xl={2} className="dashboard-col">
      <Card 
        className={`dashboard-card card-type-${type}`} 
        onClick={() => onClick(path)}
      >
        <div className="card-glass-effect"></div>
        <div className="dashboard-card-icon-wrapper">
          <Icon className="dashboard-card-icon" />
        </div>
        <Card.Body>
          <Card.Title className="dashboard-card-title">
            {title}
          </Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['profile', 'tools', 'shop', 'billing', 'admin'])
};

export default DashboardCard;