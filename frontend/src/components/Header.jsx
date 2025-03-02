// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
// import { FaShoppingCart, FaUser } from "react-icons/fa";
// import { LinkContainer } from "react-router-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { useLogoutMutation } from "../slices/usersApiSlice";
// import { logout } from "../slices/authSlice";
// import { toast } from "react-toastify";
// import SearchBox from "./SearchBox";
// import styled from "styled-components";

// const StyledNavbar = styled(Navbar)`
//   background-color: rgb(27, 178, 176) !important;
// `;

// const Header = () => {
//   const { cartItems } = useSelector((state) => state.cart);
//   const { userInfo } = useSelector((state) => state.auth);
//   const [logoutApiCall] = useLogoutMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const logoutHandler = async () => {
//     try {
//       await logoutApiCall().unwrap();
//       dispatch(logout());

//       navigate("/login");
//       toast.success("Logout successful");
//     } catch (error) {
//       toast.error(error?.data?.message || error.error);
//     }
//   };
  
//   return (
//     <StyledNavbar
//       bg="dark"
//       variant="dark"
//       expand="md"
//       collapseOnSelect
//       className="fixed-top z-2 "
//     >
//       <Container>
//         <LinkContainer to="/">
//           <Navbar.Brand>ShoeBiz </Navbar.Brand>
//         </LinkContainer>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto m-2 ">
//             <SearchBox style={{ marginRight: "5px" }} />
//             <LinkContainer to="/cart">
//               <Nav.Link>
//                 <FaShoppingCart style={{ marginRight: "5px" }} />
//                 Cart
//                 {cartItems.length > 0 && (
//                   <Badge
//                     pill
//                     bg="warning"
//                     style={{ marginLeft: "5px" }}
//                     className="text-dark"
//                   >
//                     <strong>
//                       {cartItems.reduce((acc, item) => acc + item.qty, 0)}
//                     </strong>
//                   </Badge>
//                 )}
//               </Nav.Link>
//             </LinkContainer>
//             {userInfo ? (
//               <NavDropdown title={` ${userInfo.name}`} id="username">
//                 <LinkContainer to="/profile">
//                   <NavDropdown.Item>Profile</NavDropdown.Item>
//                 </LinkContainer>
//                 <NavDropdown.Item onClick={logoutHandler}>
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             ) : (
//               <LinkContainer to="/login">
//                 <Nav.Link>
//                   <FaUser style={{ marginRight: "5px" }} />
//                   Sign In
//                 </Nav.Link>
//               </LinkContainer>
//             )}
//             {/* {userInfo && userInfo.isAdmin && (
//                 <NavDropdown title='Admin' id='adminmenu'>
//                   <LinkContainer to='/admin/product-list'>
//                     <NavDropdown.Item>Products</NavDropdown.Item>
//                   </LinkContainer>
//                   <LinkContainer to='/admin/order-list'>
//                     <NavDropdown.Item>Orders</NavDropdown.Item>
//                   </LinkContainer>
//                   <LinkContainer to='/admin/user-list'>
//                     <NavDropdown.Item>Users</NavDropdown.Item>
//                   </LinkContainer>
//                 </NavDropdown>
//               )} */}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </StyledNavbar>
//   );
// };

// export default Header;


import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";
import "../styles/Header.css";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <header className="navbar">
      {/* Left - Brand Name */}
      <div className="brand">
        <Link to="/">ShoeBiz</Link>
      </div>

      {/* Center - Large Search Bar */}
      <div className="search-container">
        <SearchBox />
      </div>

      {/* Right - Cart & Profile */}
      <div className="nav-links">
        <Link to="/cart" className="cart">
          <FaShoppingCart className="icon" />
          Cart
          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </span>
          )}
        </Link>

        {userInfo ? (
          <div className="dropdown">
            <button className="dropdown-btn">{userInfo.name}</button>
            <div className="dropdown-menu">
              <Link to="/profile">Profile</Link>
              <button onClick={logoutHandler}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login">
            <FaUser className="icon" />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
