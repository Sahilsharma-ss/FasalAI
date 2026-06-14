import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/detect", label: "Detect" },
  { to: "/chat", label: "Advisor" },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-leaf-700 font-bold text-lg">
          FasalAI
        </Link>

        {user && (
          <div className="flex items-center gap-1 sm:gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2 py-1 text-sm rounded ${
                    isActive
                      ? "text-leaf-700 font-semibold"
                      : "text-gray-500 hover:text-leaf-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 px-2"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
