import { React, useState } from "react";
import StepName from "../Step/StepName/StepName";
import StepAvatar from "../Step/StepAvatar/StepAvatar";

const steps = {
  1: StepName,
  2: StepAvatar,
};

const Activate = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];

  function onNext() {
    console.log(step);
    setStep(step + 1);
  }

  return <Step onNext={onNext} />;
};

export default Activate;
