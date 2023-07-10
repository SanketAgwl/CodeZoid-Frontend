import React from "react";
import { useState } from "react";
import { createRoom as create } from "../../http";
import TextInput from "../shared/TextInput/TextInput";
import styles from "./AddRoomModal.module.css";
import { useNavigate } from "react-router";
import Loader from "../shared/Loader/Loader";

const AddRoomModal = ({ onClose }) => {
  const [roomType, setRoomType] = useState("Public");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  async function createRoom() {
    if (!topic) return;
    try {
      setLoading(true);
      const { data } = await create({ topic, roomType });
      console.log(data);
      navigate(`/room/${data.id}`);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalMask}>
      {loading && <Loader message="Creating Room" />}
      {!loading && (
        <div className={styles.modalBody}>
          <button onClick={onClose} className={styles.close}>
            <img src="./images/close.png" alt="Close" />
          </button>
          <div className={styles.modalHeader}>
            <h3 className={styles.heading}>Enter the Topic to be discussed</h3>
            <TextInput
              fullWidth="true"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <h2 className={styles.subHeading}>Room Types</h2>
            <div className={styles.roomTypes}>
              <div
                onClick={() => setRoomType("Public")}
                className={`${styles.typeBox} ${
                  roomType === "Public" ? styles.active : ""
                }`}
              >
                <img src="./images/Globe.png" alt="Globe" />
                <span>Public</span>
              </div>

              <div
                onClick={() => setRoomType("Private")}
                className={`${styles.typeBox} ${
                  roomType === "Private" ? styles.active : ""
                }`}
              >
                <img src="./images/Lock.png" alt="Lock" />
                <span>Private</span>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            {roomType === "Public" && <h2>Start a room, open to everyone</h2>}
            {roomType === "Private" && (
              <h2>Share room link to invite guests</h2>
            )}
            <button onClick={createRoom} className={styles.footerButton}>
              <img src="./images/pop.png" alt="pop" />
              <span>Let's Go</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoomModal;
