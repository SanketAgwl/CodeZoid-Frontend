import { React, useState } from "react";
import PhoneCard from "./PhoneCard/PhoneCard";
import EmailCard from "./EmailCard/EmailCard";
import styles from "./StepPhoneEmail.module.css";
import { Navigate } from "react-router-dom";

const phoneEmailMap = {
  phone: PhoneCard,
  email: EmailCard,
};

const StepPhoneEmail = ({ onNext }) => {
  const [type, setType] = useState("email");
  const Component = phoneEmailMap[type];
  return (
    <>
      <div className={styles.cardWrapper}>
        <div>
          <div className={styles.buttonWrap}>
            <button
              onClick={() => setType("phone")}
              className={`${styles.tabButton} ${
                type === "phone" && styles.active
              }`}
            >
              <img src="/images/phone_white.png" alt="phone" />
            </button>
            <button
              onClick={() => setType("email")}
              className={`${styles.tabButton} ${
                type === "email" && styles.active
              }`}
            >
              <img src="/images/mail_white.png" alt="mail" />
            </button>
          </div>
          <Component onNext={onNext} />
        </div>
      </div>
    </>
  );
};

export default StepPhoneEmail;
