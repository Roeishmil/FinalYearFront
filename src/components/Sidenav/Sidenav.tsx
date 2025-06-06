import { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Book,
  User,
  Bell,
  LogOut,
  Share2,
  MenuSquare,
  SquarePen,
   TextSelect
} from "lucide-react";
import styles from "./Sidenav.module.css";
import useUser from "../../hooks/useUser";
import Logo from "../../assets/Logo.png";

const Sidenav: FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(undefined);
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      {/* ─── Brand ─── */}
      <div className={styles.brand}>
        <img src={Logo} alt="Logo" style={{ width: 30, height: 30 }} />
        <span>Why Not 100?</span>
      </div>

      {/* ─── Current user (mini card) ─── */}
      {user && (
        <div className={styles.userCard}>
          <p className={styles.userName}>{user.fullName}</p>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      )}

      {/* ─── Nav links ─── */}
      <nav className={styles.nav}>
        <Link to="/profile" className={`${styles.link}  ${pathname.startsWith("/profile") ? styles.active : ""}`}>
          <User size={18} />
          Profile
        </Link>
        <Link to="/" className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>
          <Book size={18} />
          Subjects
        </Link>
        <Link to="/generate" className={`${styles.link} ${pathname.endsWith("/generate") ? styles.active : ""}`}>
          <FileText size={18} />
          Generated&nbsp;Content
        </Link>
        <Link to="/generate-test" className={`${styles.link} ${pathname.startsWith("/generate-test") ? styles.active : ""}`}>
          <SquarePen size={16} />
          Create Test
        </Link>
        <Link to="/generate-summary" className={`${styles.link} ${pathname.startsWith("/generate-summary") ? styles.active : ""}`}>
          <TextSelect size={16} />
          Create Summary
        </Link>
        <Link
          to="/shared-content"
          className={`${styles.link} ${
            pathname.startsWith("/shared-content") ? styles.active : ""
          }`}
        >
          <Share2 size={18} />
          Shared Content
        </Link>
        <Link
          to="/notifications"
          className={`${styles.link} ${
            pathname.startsWith("/notifications") ? styles.active : "" }`} >
          <Bell size={18} />
          Notifications
        </Link>
      </nav>

      {/* ─── Logout ─── */}
      <button onClick={handleLogout} className={styles.logout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidenav;
