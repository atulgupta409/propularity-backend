import React, { useState, useEffect, useContext } from "react";
import loginbg from "./login-bg.jpg";
import "./Login.css";
import logo from "./spacite-logo.png";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GpState } from "../../context/context";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = GpState();

  const handleClick = () => {
    setShow(!show);
  };
  const getAds = async () => {
    try {
      const { data } = await axios.get(`/api/message`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAds();
  }, []);
  const submitHandle = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all The Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", user.token);
      setLoading(false);
      navigate("/listing-space", { replace: true });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mainBox">
        <div className="container my-5">
          <div className="row ml-0 mr-0">
            <div className="col-md-6 px-0 d-flex align-items-center justify-content-center">
              <div style={{ width: "50%" }}>
                <img
                  className=""
                  style={{ width: "130px", margin: "auto" }}
                  src={logo}
                  alt="logo"
                />
                <VStack spacing="-10px">
                  <FormControl id="emaillogin" isRequired>
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type={"text"}
                    />
                  </FormControl>
                  <InputGroup>
                    <FormControl id="passwordlogin" isRequired>
                      <Input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                      />
                    </FormControl>
                    <InputRightElement top="15px" width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitHandle}
                    isLoading={loading}
                  >
                    Login
                  </Button>
                </VStack>
              </div>
            </div>
            <div className="col-md-6 px-0">
              <img
                className="img-fluid"
                src={loginbg}
                alt="login-bg"
                style={{ height: "515px", borderRadius: "0 14px 14px 0" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
