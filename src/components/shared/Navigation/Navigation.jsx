import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useState } from "react";
import Loader from "../Loader/Loader";

const Navigation = () => {
  const brandStyles = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "10px",
  };
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  async function logOut() {
    try {
      setLoading(true);
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader message="Logging out" />;

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyles} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>CodeZoid</span>
      </Link>
      {user && user.activated && (
        <div className={styles.navRight}>
          <h3>{user.name}</h3>
          <Link to={`/profile/${user.id}`}>
            <div className={styles.avatar}>
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </Link>
          <button className={styles.logout} onClick={logOut}>
            <img src="./images/exit.png" alt="exit" width="30" height="auto" />
          </button>
        </div>
      )}

      {/* {user && user.activated && <button onClick={logOut}>Log Out</button>} */}
    </nav>
  );
};

export default Navigation;
