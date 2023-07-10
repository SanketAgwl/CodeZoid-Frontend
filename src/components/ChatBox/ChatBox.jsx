import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatBox.module.css";

const ChatBox = ({ messages, sendMessage, user, clients }) => {
  const messageContainerRef = useRef(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      await sendMessage({
        type: "chat",
        text: inputText,
        sender: user,
        time: new Date().toLocaleTimeString(),
      });
      setInputText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <h1 className={styles.serviceHead}>Chat</h1>
      <div className={styles.chatBox}>
        <div className={styles.messageContainer} ref={messageContainerRef}>
          {messages.map((message, index) => {
            if (message.type !== "chat") {
              return null; // Skip rendering non-chat messages
            }

            return (
              <div
                className={`${styles.message} ${
                  message.sender === user ? styles.myMessage : ""
                }`}
                key={index}
              >
                {message.senderId !== user.id && (
                  // Render sender info for others' messages
                  <div className={styles.senderInfo}>
                    <div className={styles.imgCover}>
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className={styles.profileImage}
                      />
                    </div>
                    <div className={styles.senderName}>
                      {message.sender.name}
                    </div>
                  </div>
                )}
                <div className={styles.messageText}>{message.text}</div>
                <div className={styles.messageTime}>{message.time}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <button className={styles.sendButton} onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
