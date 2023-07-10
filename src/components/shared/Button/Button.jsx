import React from "react";
import styles from "./Button.module.css";

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={styles} className={styles.button}>
      <span>{children}</span>
      <img className={styles.arrow} src="./images/arrow_forward.png" alt="" />
    </button>
  );
};

export default Button;
