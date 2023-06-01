import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [showModal, setShow] = useState(false);
  const [user, setUser] = useState();
  const [country, setCountry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const navigate = useNavigate();
  let isLogin = localStorage.getItem("token") ? true : false;
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getSeoData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/seo/seos");
      setLoading(false);
      setSeoData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSeoData();
  }, [updateTable]);

  return (
    <AppContext.Provider
      value={{
        handleClose,
        handleShow,
        showModal,
        user,
        setUser,
        isLogin,
        country,
        setCountry,
        seoData,
        updateTable,
        setUpdateTable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const GpState = () => {
  return useContext(AppContext);
};

export default AppProvider;
