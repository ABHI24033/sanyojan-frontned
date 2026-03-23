import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useOTPVerification = (length = 4, phone) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [timer, setTimer] = useState(30);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const inputsRef = useRef([]);
  const navigate=useNavigate();

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };


  return {
    otp,
    timer,
    alert,
    inputsRef,
    setAlert,
    handleChange,
    handleKeyDown,
    setOtp,
    setTimer,
  };
};
