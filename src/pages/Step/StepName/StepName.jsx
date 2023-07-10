import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepName.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const [fullname, setFullName] = useState(name);
  const dispatch = useDispatch();

  function nextStep() {
    if (!fullname) return;
    dispatch(setName(fullname));
    onNext();
  }
  return (
    <div className={styles.cardWrapper}>
      <Card title="What's your full name?" icon="goggle">
        <div className={styles.inputWrap}>
          <TextInput
            type="tel"
            value={fullname}
            placeholder="Your name"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <p className={styles.bottomPara}>People use real name at codeZoid :)</p>
        <div>
          <div className={styles.actionButtonWrap}>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepName;
