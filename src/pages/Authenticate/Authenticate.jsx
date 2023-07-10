import { React, useState } from "react";
import StepPhoneEmail from "../Step/StepPhoneEmail/StepPhoneEmail";
import StepOtp from "../Step/StepOtp/StepOtp";

const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
};

const Authenticate = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];

  function onNext() {
    console.log(step);
    setStep(step + 1);
  }

  return <Step onNext={onNext} />;
};

export default Authenticate;
