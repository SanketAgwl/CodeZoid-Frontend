import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";

const EmailCard = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  async function submit() {
    if (!email) return;
    const { data } = await sendOtp({ email: email });
    console.log(data);
    dispatch(setOtp({ email: data.email, hash: data.hash }));
    onNext();
  }
  return (
    <Card title="Enter you email id" icon="mail">
      <TextInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button onClick={submit}>Next</Button>
        </div>
        <p className={styles.bottomPara}>
          By entering your email, you’re agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default EmailCard;
