import React, { useContext, useEffect, useState } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import { Context } from "../context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

//const { Item } = Menu.Items;
const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;
  useEffect(() => {
    //if page location changes by inside page link, effects on active-nav-link
    typeof window !== "undefined" && setCurrent(window.location.pathname);
  });
  const router = useRouter();
  const logout = async () => {
    //
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };
  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Menu.Item
        onClick={(e) => setCurrent(e.key)}
        key="/"
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <span>App</span>
        </Link>
      </Menu.Item>
      {user === null && (
        <>
          <Menu.Item
            onClick={(e) => setCurrent(e.key)}
            key="/login"
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              <span>Login</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            onClick={(e) => setCurrent(e.key)}
            key="/register"
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              <span>Register</span>
            </Link>
          </Menu.Item>
        </>
      )}
      {user !== null && (
        <>
          <Menu.SubMenu
            key="SubMenu"
            title={user && user.name}
            icon={<UserOutlined />}
            style={{ marginLeft: "auto" }}
          >
            <Menu.Item key="/user" icon={<DashboardOutlined />}>
              <Link href="/user">
                <span>Dashbard</span>
              </Link>
            </Menu.Item>
            <Menu.Item onClick={logout} icon={<LogoutOutlined />}>
              <span>logout</span>
            </Menu.Item>
          </Menu.SubMenu>
        </>
      )}
    </Menu>
  );
};
export default TopNav;
