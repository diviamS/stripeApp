import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
const Header = () => {
  return (
    <div>
      <div className="container">
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-lg-between"
          >
            <Navbar.Brand as={Link} to="/">
              Payment gatway stripe
            </Navbar.Brand>
            <Nav className="">
              <NavLink className="nav-link" to="/simplepayment">
               Simple payment
              </NavLink>
              <NavLink className="nav-link" to="/subscriptionplan">
               Subscription plan
              </NavLink>
              <NavLink className="nav-link" to="/capture">
               Capture and pay later
              </NavLink>
              <NavLink className="nav-link" to="/payemensplit">
               Payment split
              </NavLink>
            </Nav>
          </Navbar.Collapse> 
        </Navbar>
      </div>

    </div>
  );
};

export default Header;
