import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import TextInput from "../../../components/shared/TextInput/TextInput";
import styles from "./StepOtp.module.css";
import { verifyOtp } from "../../../http";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { phone, email, hash } = useSelector((state) => state.auth.otp);
  async function submit() {
    if (!otp || !(email || phone) || !hash) return;

    try {
      setLoading(true);
      const { data } = await verifyOtp({ otp, phone, email, hash });
      console.log(data);
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader message="Validating Otp, please wait..." />;
  return (
    <div className={styles.cardWrapper}>
      <Card title="Enter the code we just sent you" icon="lock_emoji">
        <div className={styles.inputWrap}>
          <TextInput
            type="tel"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <div>
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepOtp;
