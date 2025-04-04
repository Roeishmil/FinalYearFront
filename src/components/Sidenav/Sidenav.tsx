import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidenavStyle from "./Sidenav.module.css";
import Logo from "../../assets/Logo.png";
import useUser from "../../hooks/useUser";

const Sidenav: FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(undefined);

    navigate("/login");
  };
  return (
    <div className={SidenavStyle.container}>
      <img src={Logo} className={SidenavStyle.logo} />
      <div className={SidenavStyle.user}>Hello, {user?.fullName}</div>
      <nav className={SidenavStyle.nav}>
        <Link to="/">profile</Link>
        <Link to="/test">test</Link>
        <Link to="/summary">summary</Link>
      </nav>
      <button className={SidenavStyle.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};
export default Sidenav;
