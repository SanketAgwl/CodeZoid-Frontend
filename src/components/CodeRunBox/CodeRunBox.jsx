import React, { useEffect, useRef } from "react";
import styles from "./CodeRunBox.module.css";
import { MutatingDots } from "react-loader-spinner";

const CodeRunBox = ({
  stdout,
  stderr,
  isLoading,
  isRunning,
  runCode,
  messages,
  sendMessage,
  user,
  clients,
}) => {
  const userColorRef = useRef(null); // Reference to store the user's random color

  const getRandomColor = () => {
    // Generate a random color in hexadecimal format
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleOutput = async () => {
    await runCode();
  };

  useEffect(() => {
    let timerId = null;
    const delayDuration = 500; // Set the delay duration in milliseconds (e.g., 5000 for 5 seconds)

    const handleOutput = async () => {
      clearTimeout(timerId); // Clear the previous timer

      // Start a new timer
      timerId = setTimeout(async () => {
        if (stdout || stderr) {
          await sendMessage({
            type: "output",
            text: stderr ? stderr : stdout,
            sender: user,
            time: new Date().toLocaleTimeString(),
            color: userColorRef.current, // Use the user's random color
          });
        }
      }, delayDuration);
    };

    handleOutput();

    // Clean up the timer on component unmount
    return () => {
      clearTimeout(timerId);
    };
  }, [stdout, stderr]);

  const scrollableContainerRef = useRef(null);

  useEffect(() => {
    // Generate a random color for the user
    userColorRef.current = getRandomColor();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the scrollable container whenever new messages are added
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <h1 className={styles.serviceHead}>Console</h1>
      <div className={styles.consoleBox}>
        <div className={styles.console}>
          <span>Output</span>
          <div
            className={styles.scrollableContainer}
            ref={scrollableContainerRef}
          >
            <pre>
              {messages.map((message, index) => {
                if (message.type === "output") {
                  const color =
                    message.sender === user
                      ? userColorRef.current
                      : message.color;
                  const messageStyle = {
                    backgroundColor: color,
                    color: color === "#ffffff" ? "#000000" : "#ffffff",
                  };

                  return (
                    <div
                      className={styles.outputMessage}
                      style={messageStyle}
                      key={index}
                    >
                      <div>{message.sender.name}</div>
                      <div>{message.text}</div>
                      <div className={styles.messageTime}>{message.time}</div>
                    </div>
                  );
                }
                return null;
              })}
            </pre>
          </div>
        </div>
        <div className={styles.runner}>
          {isLoading || isRunning ? (
            <MutatingDots height="100" width="100"></MutatingDots>
          ) : (
            <button onClick={handleOutput}>
              <span>Run</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CodeRunBox;
