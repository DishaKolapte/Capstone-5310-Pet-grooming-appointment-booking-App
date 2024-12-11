import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first load after login
    const shouldRefresh = sessionStorage.getItem('shouldRefresh');
    if (shouldRefresh === 'true') {
      sessionStorage.removeItem('shouldRefresh');
      window.location.reload();
      return;
    }
  }, []);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(hideLoading());
        setLoading(false);
        return navigate("/login");
      }

      const res = await axios.post(
        "https://capstone-5310-pet-grooming-appointment.onrender.com/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Auth error:", error);
      localStorage.clear();
      dispatch(hideLoading());
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  return children;
}
