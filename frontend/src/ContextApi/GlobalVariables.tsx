import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";

// Define the shape of a single cart item
type CartItem = {
  customerId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageLink: string;
  category:string
};

// Create a global context
const GlobalContext = createContext<any>(null);

const GlobalProvider = ({ children }: any) => {
  // UI State
  const [isMenuClicked, setIsMenuClicked] = useState<boolean>(false);
  const [openReviewForm, setOpenReviewForm] = useState<boolean>(false);

  // Cart data
  const [cartDetails, setCartDetails] = useState<CartItem[]>([]);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>();

  // Ref to manage the interval for auth validation
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  

  /**
   * Function to validate user's login status.
   * If successful, sets login state and customerId.
   * If failed, clears the login state.
   */
  const handleLoginState = async () => {
    try {
      const url = "http://localhost:3000/api/customAuth/validate";
      const response = await axios.get(url, { withCredentials: true });
      const id = (response?.data as any)?.customerId;
      
      setIsLoggedIn(true);
      setCustomerId(id);
      console.log("Validated:", id);
    } catch (error) {
      setIsLoggedIn(false);
      setCustomerId(undefined);
      console.log("Not logged in");
    }
  };

  /**
   * On first render: validate user login status once.
   */
  useEffect(() => {
    handleLoginState();
  }, []);

  /**
   * Watches `isLoggedIn` state.
   * - Starts interval to keep validating login status every 3s when logged in.
   * - Clears interval when logged out or on component unmount.
   */
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
        setCustomerId(undefined);
        setCartDetails([]);

        // console.log("Cleared interval");
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

  /**
   * Fetch user cart after login.
   * Runs once when `isLoggedIn` becomes true.
   */
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const url = `http://localhost:3000/api/userCartData?customerId=${customerId}`;
        const response = await axios.get<{ data: CartItem[] }>(url, {
          withCredentials: true,
        });

        setCartDetails(response?.data?.data);
        // console.log("🛒 Cart loaded:", response?.data?.data);
      } catch (error) {
        console.log("Failed to load cart", error);
      }
    };

    if (isLoggedIn && customerId) {
      fetchCartData();
    }
  }, [isLoggedIn, customerId]);

  return (
    <GlobalContext.Provider
      value={{
        customerId,
        setCustomerId,
        isMenuClicked,
        setIsMenuClicked,
        openReviewForm,
        setOpenReviewForm,
        cartDetails,
        setCartDetails,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
