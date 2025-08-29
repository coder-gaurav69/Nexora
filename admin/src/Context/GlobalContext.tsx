import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  customerId: string;
  setCustomerId: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLoginState = async () => {
    try {
      console.log("hello",customerId)
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/customAuth/validate`;
      const response = await axios.get(url, { withCredentials: true });
      const id = (response?.data as any).customerId
      setIsLoggedIn(true);
      setCustomerId(id);
      console.log("Validated:", id);
    } catch (error) {
      setIsLoggedIn(false);
      setCustomerId("");
      console.log("Not logged in");
    }
  };

  useEffect(()=>{
    handleLoginState();
  },[isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      intervalRef.current = setInterval(() => {
        handleLoginState();
      }, 300000);
      // console.log("Started interval");
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setCustomerId("");
      }
    }

    // Cleanup when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        // console.log("Cleanup interval");
      }
    };
  }, [isLoggedIn]);



  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, customerId, setCustomerId }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
