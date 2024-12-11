import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axiosInstance.post("https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/user/getUserData");
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching user data:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    }
  }, [user]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
