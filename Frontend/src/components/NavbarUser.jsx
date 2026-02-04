import React, { useEffect, useState } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

export default function NavbarUser() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <MDBNavbar light bgColor="light" className="shadow-sm mb-4">
      <MDBContainer fluid className="d-flex justify-content-between align-items-center">
        <MDBNavbarBrand href="#" className="fw-bold text-primary">
          <MDBIcon fas icon="chart-line" className="me-2 text-success" />
          EDF Finance
        </MDBNavbarBrand>

        <div className="d-flex align-items-center">
          <MDBDropdown>
            <MDBDropdownToggle
              tag="a"
              className="d-flex align-items-center hidden-arrow"
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                backgroundColor: "#e9ecef",
                justifyContent: "center",
              }}
            >
              <MDBIcon fas icon="user" size="lg" className="text-secondary" />
            </MDBDropdownToggle>

            <MDBDropdownMenu className="dropdown-menu-end shadow-sm">
              <MDBDropdownItem header>
                ✅ Connecté en tant que <strong>{username || "Utilisateur"}</strong>
              </MDBDropdownItem>
              <MDBDropdownItem divider />
              <MDBDropdownItem link onClick={handleLogout} className="text-danger">
                <MDBIcon fas icon="sign-out-alt" className="me-2" />
                Se déconnecter
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
}
