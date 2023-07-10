import React, { useEffect, useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepAvatar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepAvatar = ({ onNext }) => {
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/default_img.png");
  const [unmounted, setUnmounted] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  function captureChange(e) {
    console.log(e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
      console.log(reader.result);
    };
  }

  async function nextStep() {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar });
      console.log(data);
      if (data.auth) {
        if (!unmounted) dispatch(setAuth(data));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setUnmounted(true);
    };
  }, []);

  if (loading) return <Loader message="Activation in progress..." />;
  return (
    <div className={styles.cardWrapper}>
      <Card title={`Okay ${name}!`} icon="monkey">
        <p className={styles.topPara}>How's this photo?</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImg} src={image} alt="avatar" />
        </div>
        <div>
          <input
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
            onChange={captureChange}
          />
          <label htmlFor="avatarInput" className={styles.avatarLabel}>
            Choose a different photo
          </label>
        </div>
        <div className={styles.actionButtonWrap}>
          <Button onClick={nextStep}>Next</Button>
        </div>
      </Card>
    </div>
  );
};

export default StepAvatar;
