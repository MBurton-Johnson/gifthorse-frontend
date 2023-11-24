import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useState, useEffect } from "react";
import '../../styles/components/navigation.css';

export function Navigation() {

  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div>
      <Navbar>
      <Navbar.Brand href="/" className="navbar-brand-custom">Gift Horse</Navbar.Brand>
        <Nav className="me-auto">
          {isAuth ? <Nav.Link href="/">Home</Nav.Link> : null}
          {isAuth ? <Nav.Link href="/add-gift">Add Gift</Nav.Link> : null}
          {isAuth ? <Nav.Link href="/my-gifts"> My Gifts</Nav.Link> : null}
          {isAuth ? <Nav.Link href="/my-recipients"> My Recipients</Nav.Link> : null}
          {isAuth ? <Nav.Link href="/my-occasions"> My Occasions</Nav.Link> : null}
        </Nav>
        <Nav>
          {isAuth ? (
            <Nav.Link href="/logout">Logout</Nav.Link>
          ) : (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}