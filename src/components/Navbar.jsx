import {useState} from "react";
import {Link} from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
      <nav className="navbar">
        <div className="logo">
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28" data-qa="IconSvg"
               className="c53a882e3e e74c0b26c7">
            <path fill="#07F"
                  d="M18.211 14A4.216 4.216 0 0114 18.211 4.216 4.216 0 019.789 14 4.216 4.216 0 0114 9.789 4.216 4.216 0 0118.211 14zM14 0C6.28 0 0 6.28 0 14s6.28 14 14 14a13.92 13.92 0 007.886-2.435l.04-.028-1.886-2.193-.031.021A11.088 11.088 0 0114 25.13C7.863 25.13 2.87 20.137 2.87 14 2.87 7.863 7.863 2.87 14 2.87c6.137 0 11.13 4.993 11.13 11.13 0 .795-.088 1.6-.262 2.392-.352 1.445-1.364 1.888-2.123 1.829-.764-.062-1.658-.606-1.664-1.938V14A7.089 7.089 0 0014 6.919 7.089 7.089 0 006.919 14 7.089 7.089 0 0014 21.081a7.026 7.026 0 005.017-2.09 4.548 4.548 0 003.498 2.09 4.724 4.724 0 003.218-.943c.839-.637 1.465-1.558 1.812-2.665.055-.179.157-.588.157-.59l.003-.016C27.91 15.98 28 15.094 28 14c0-7.72-6.28-14-14-14"></path>
          </svg>
          <span className="logo-text">джампер</span>
        </div>
        <ul className={menuOpen ? "nav-links open" : "nav-links"}>
          <li><Link to="/">Играть</Link></li>
          <li><Link to="/rating">Рейтинг</Link></li>
          <li><Link to="/tasks">Задания</Link></li>
          <li><Link to="/shop">Магазин</Link></li>
        </ul>

        <div className="nav-links">
          <a href="#">Регистрация</a>
          <button className="auth-button">Войти</button>
        </div>
      </nav>
  );
}
