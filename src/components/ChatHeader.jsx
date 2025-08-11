import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Settings, User } from "lucide-react";

const ChatHeader = ({ isSidebarOpen }) => (
  <Navbar className="chat-header" style={{ left: isSidebarOpen ? "280px" : "80px" }}>
    <Container fluid>
      <Navbar.Brand>Current Conversation</Navbar.Brand>
      <Nav>
        <Nav.Link><Settings size={20} /></Nav.Link>
        <Nav.Link><User size={20} /></Nav.Link>
      </Nav>
    </Container>
  </Navbar>
);

export default ChatHeader;
