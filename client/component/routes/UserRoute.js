import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";

const UserRoute = ({ children }) => {
  const [hidden, setHidden] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/current-user");
        //console.log(data);
        if (data.ok) setHidden(false);
      } catch (error) {
        console.log(error);
        setHidden(true);
        router.push("/login");
      }
    };
    fetchUser();
  });

  return (
    <>
      {!hidden ? (
        <>{children}</>
      ) : (
        <SyncOutlined
          spin
          className="d-flex justify-content-center dispplay-1 text-primary p-5"
        />
      )}
    </>
  );
};

export default UserRoute;
