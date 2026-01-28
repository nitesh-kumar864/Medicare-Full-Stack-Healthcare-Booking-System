import { useState, useRef } from "react";
import axios from "axios";

const useUsernameAvailability = ({
  backendUrl,
  token = null,
  minLength = 4,
  currentUsername = null,
}) => {
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const lastRequestRef = useRef(0);

  const checkUsernameAvailability = async (value) => {
    const newUsername = value.toLowerCase().trim();
    setUsername(newUsername);

    setUsernameStatus("");
    setIsUsernameValid(false);

    if (currentUsername && newUsername === currentUsername) {
      setUsernameStatus("This is already your current username");
      return;
    }

    if (newUsername.length < minLength) {
      setUsernameStatus(
        `Username must be at least ${minLength} characters`
      );
      return;
    }

    const requestId = ++lastRequestRef.current;

    try {
      setCheckingUsername(true);

      const { data } = await axios.post(
        backendUrl + "/api/user/check-username",
        { username: newUsername },
        token ? { headers: { token } } : {}
      );

      if (requestId !== lastRequestRef.current) return;

      if (data.available) {
        setUsernameStatus("Username available");
        setIsUsernameValid(true);
      } else {
        setUsernameStatus(data.message);
        setIsUsernameValid(false);
      }
    } catch {
      if (requestId !== lastRequestRef.current) return;
      setUsernameStatus("Error checking username");
      setIsUsernameValid(false);
    } finally {
      if (requestId === lastRequestRef.current) {
        setCheckingUsername(false);
      }
    }
  };

  return {
    username,
    setUsername,
    usernameStatus,
    isUsernameValid,
    checkingUsername,
    checkUsernameAvailability,
  };
};

export default useUsernameAvailability;
