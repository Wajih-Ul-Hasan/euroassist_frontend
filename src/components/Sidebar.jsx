// src/components/Sidebar.js
import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <h5>Quick Info 📌</h5>
      <hr className="text-secondary" />
      <ListGroup variant="flush">
        <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          Top 10 Universities for CS
        </ListGroup.Item>
        <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          Scholarship Deadlines 2025
        </ListGroup.Item>
        <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          How to Apply for a Visa
        </ListGroup.Item>
        <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          Cost of Living in Germany
        </ListGroup.Item>
      </ListGroup>

      <h5 className="mt-4">Featured Universities ✨</h5>
      <hr className="text-secondary" />
      <ListGroup variant="flush">
         <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          ETH Zurich
        </ListGroup.Item>
        <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          University of Cambridge
        </ListGroup.Item>
        <ListGroup.Item action className="bg-dark text-white-50 border-secondary px-2">
          TU Munich
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Sidebar;