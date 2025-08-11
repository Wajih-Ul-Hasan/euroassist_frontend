import React from "react";
import { Button, Nav, Form, InputGroup } from "react-bootstrap";
import { Search, Folder, MessageSquare, Plus, ArrowLeftRight } from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const folders = ["Admissions 2025", "Scholarship Hunt", "Visa Process"];
  const chats = ["Top CS Universities", "Business Schools in France", "Affordable German Universities"];

  return (
    <div className={`sidebar p-3 ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
        {isSidebarOpen && <h1 className="h5 mb-0 sidebar-brand-text">EuroAssist.ai</h1>}
        <Button variant="dark" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="ms-auto">
          <ArrowLeftRight size={20} />
        </Button>
      </div>
      {isSidebarOpen && (
        <InputGroup className="mb-3">
          <InputGroup.Text><Search size={16} /></InputGroup.Text>
          <Form.Control placeholder="Search chats..." />
        </InputGroup>
      )}
      <Nav className="flex-column flex-grow-1">
        {isSidebarOpen && <h6 className="text-muted small text-uppercase">Folders</h6>}
        {folders.map(folder => (
          <Nav.Link key={folder} className="d-flex align-items-center gap-3">
            <Folder size={20} /> {isSidebarOpen && <span>{folder}</span>}
          </Nav.Link>
        ))}
        {isSidebarOpen && <h6 className="text-muted small text-uppercase mt-4">Recent Chats</h6>}
        {chats.map(chat => (
          <Nav.Link key={chat} className="d-flex align-items-center gap-3">
            <MessageSquare size={20} /> {isSidebarOpen && <span>{chat}</span>}
          </Nav.Link>
        ))}
      </Nav>
      <div className="mt-auto">
        <Button variant="success" className="w-100 d-flex align-items-center justify-content-center gap-2">
          <Plus size={20} /> {isSidebarOpen && "New Chat"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
