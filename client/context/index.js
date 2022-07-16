import { useReducer, createContext, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";

//intial state
const inialState = {
  user: null,
};

//creete context
const Context = createContext();

//reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

//context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, inialState);
  const router = useRouter();
  //to stop useEffect run twice.
  const effectRun = useRef(false);
  useEffect(() => {
    if (effectRun.current === false) {
      const getCsrfToken = async () => {
        const { data } = await axios.get("/api/csrf-token");
        console.log("csrf", data);
        axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
      };
      getCsrfToken();
      dispatch({
        type: "LOGIN",
        payload: JSON.parse(window.localStorage.getItem("user")),
      });
      return () => {
        effectRun.current = true;
      };
    }
  }, []);

  axios.interceptors.response.use(
    (response) => {
      //any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    (err) => {
      //any status codes that falls outside tthe range of 2xx cause this function to trigger
      let res = err.response;
      if (res.status === 401 && res.config && !res.config.__isRetryReqquest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error >> logout");
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((error) => {
              console.log("AXIOS INTERCEPTIONS", error);
              reject(err);
            });
        });
      }
      return Promise.reject(err);
    }
  );

  // useEffect(() => {
  //   const getCsrfToken = async () => {
  //     const { data } = await axios.get("/api/csrf-token");
  //     console.log("csrf", data);
  //     axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
  //   };
  //   getCsrfToken();
  // });

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
