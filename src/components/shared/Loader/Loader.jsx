import React from "react";
import Card from "../Card/Card";
import styles from "./Loader.module.css";
import { MutatingDots } from "react-loader-spinner";

const Loader = ({ message }) => {
  return (
    <div className={styles.cardWrapper}>
      <Card>
        <div className={styles.contentWrapper}>
          <span className={styles.message}>{message}</span>
          <MutatingDots
            color="#0077ff"
            secondaryColor="#0077ff"
            height="100"
            width="100"
          />
        </div>
      </Card>
    </div>
  );
};

export default Loader;
