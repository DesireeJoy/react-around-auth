import logo from "../images/Logo.svg";
import { render } from "react-dom";

function Header(props) {
  return (
    <header className="header">
      <img
        id="logo-img"
        alt="Around the US Logo"
        src={logo}
        className="header__logo"
      />
    </header>
  );
}

export default Header;
