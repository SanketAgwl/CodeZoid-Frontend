import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

const Home = () => {
  const navigate = useNavigate();
  const singinLinkStyle = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "10px",
  };

  function startRegister() {
    navigate("/authenticate");
  }

  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to CodeZoid" icon="logo">
        <p className={styles.text}>
          where coding collides with collaboration! Step into our virtual rooms
          and unlock the power of shared coding, where developers like you can
          connect, create, and conquer together!
        </p>
        <div>
          <Button onClick={startRegister}>Lets Go</Button>
        </div>
      </Card>
    </div>
  );
};

export default Home;
