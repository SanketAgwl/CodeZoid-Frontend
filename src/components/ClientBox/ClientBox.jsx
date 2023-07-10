import React from "react";
import { Link } from "react-router-dom";
import styles from "./ClientBox.module.css";

const ClientBox = ({ clients, provideRef, handleMuteClick, user }) => {
  console.log(clients);
  if (!clients) return <div></div>;
  return (
    <>
      <h1 className={styles.serviceHead}>All Connected clients</h1>
      <div className={styles.clientList}>
        {clients.map((client) => {
          return (
            <div className={styles.userHead} key={client.id}>
              <audio
                playsInline
                ref={(instance) => provideRef(instance, client.id)}
                autoPlay
              ></audio>
              <Link
                to={`/profile/${client.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.imgWrap}>
                  <img
                    src={client.avatar}
                    className={styles.userAvatar}
                    alt="avatar"
                  />
                </div>
              </Link>
              <span>{client.name}</span>
              <div
                className={`${styles.buttonWrap}  ${
                  client.id === user.id ? styles.mymic : ""
                }`}
              >
                <button
                  onClick={() => handleMuteClick(client.id)}
                  className={`${styles.micBtn} `}
                >
                  {client.muted ? (
                    <img
                      className={styles.mic}
                      src="/images/mic-mute.png"
                      alt="mic"
                    />
                  ) : (
                    <img
                      className={styles.micImg}
                      src="/images/mic.png"
                      alt="mic"
                    />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ClientBox;
