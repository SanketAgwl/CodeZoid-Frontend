import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export function useLoadingWithRefresh() {
  const [loading, setLaoding] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}api/refresh`,
          {
            withCredentials: true,
          }
        );
        dispatch(setAuth(data));
        setLaoding(false);
      } catch (err) {
        console.log(err);
        setLaoding(false);
      }
    })(() => {});
  }, []);
  return { loading };
}
