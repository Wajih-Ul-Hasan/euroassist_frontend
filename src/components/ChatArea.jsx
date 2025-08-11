import React, { useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import WelcomeScreen from "./WelcomeScreen";
import Message from "./Message";
import LoadingIndicator from "./LoadingIndicator";

const ChatArea = ({ messages, isLoading, onPromptClick }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <Container fluid className="p-4 chat-area" ref={chatContainerRef}>
      <Row className="justify-content-center">
        <Col lg={8}>
          {messages.length === 1 && !isLoading ? (
            <WelcomeScreen onPromptClick={onPromptClick} />
          ) : (
            <>
              {messages.map((msg, index) => <Message key={index} sender={msg.sender} text={msg.text} />)}
              {isLoading && <LoadingIndicator />}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatArea;
