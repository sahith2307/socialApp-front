import React from "react";
import history from "../../routes/history";
import "./Navbar.scss";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
import {
  AddAPhotoOutlined,
  AddBoxOutlined,
  BookmarkBorder,
  BookmarkOutlined,
  Home,
  Label,
  LockReset,
  Logout,
  ManageAccounts,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { Avatar, Badge, Button, Fade, Popper } from "@mui/material";
import ImageUpload from "../Popups/uploadImage/ImageUpload";
import Popup from "reactjs-popup";
import { Box, styled } from "@mui/system";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { authenticationService } from "../../utils/auth.service";
import { Modal } from "react-bootstrap";
import EditProfile from "../Popups/edit-profile/editProfile";

export type NavbarProps = {
  /**
   * To be triggered on logout click
   */
  onLogout?: any;
};

export const Navbar = ({ onLogout }: NavbarProps) => {
  const [close, setClose] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const onClickProfile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const profilePopperID = canBeOpen ? "spring-popper" : undefined;

  const imagePopper = (event: React.MouseEvent<HTMLElement>) => {
    setClose((prev) => !prev);
  };
  const user = useSelector((state: any) => state.userData.user);
  return (
    <AppBar
      sx={{
        position: "fixed",
        width: "100vw",
        display: "flex",
        backgroundColor: "#ffffff",
        top: 0,
        zIndex: 99,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <img
            src="https://res.cloudinary.com/sahith/image/upload/v1654756082/Logo_hr2fsm.png"
            alt="icon"
            className="icon-config"
          />
        </IconButton>
        <Box>
          <Tooltip
            title="home"
            onClick={authenticationService.redirectToHomePage}
          >
            <IconButton sx={{ color: "#000000", marginLeft: "auto" }}>
              <Home />
            </IconButton>
          </Tooltip>
          <Popup
            trigger={
              <Tooltip title="new post" onClick={imagePopper}>
                <IconButton
                  sx={{ color: "#000000", marginLeft: "auto" }}
                  aria-describedby={"me"}
                >
                  <AddAPhotoOutlined />
                </IconButton>
              </Tooltip>
            }
            modal
            nested
          >
            <ImageUpload />
          </Popup>

          <Tooltip
            title="saved"
            onClick={authenticationService.redirectToSavedPage}
          >
            <IconButton sx={{ color: "#000000", marginLeft: "auto" }}>
              <BookmarkBorder />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClickProfile}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              variant="dot"
              color="success"
            >
              <Avatar alt={user.name} src={user.image || "https://sajsd.com"} />
            </Badge>
            <label className="userNameNav">{user.name}</label>
          </IconButton>

          <Popper
            placement="top"
            disablePortal={true}
            id={profilePopperID}
            open={open}
            anchorEl={anchorEl}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps}>
                <Box className="profilePopper">
                  <IconButton
                    onClick={() => {
                      setOpenProfile(true);
                      setOpen(false);
                    }}
                  >
                    <ManageAccounts />
                    <label className="popupNames">profile</label>
                  </IconButton>
                  <IconButton>
                    <LockReset />
                    <label className="popupNames">change password</label>
                  </IconButton>
                  <IconButton onClick={onLogout}>
                    <Logout />
                    <label className="popupNames">logout</label>
                  </IconButton>
                </Box>
              </Fade>
            )}
          </Popper>
          <Modal
            show={openProfile}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setOpenProfile(false)}
          >
            <Modal.Header closeButton>
              <div className="mx-auto ps-5">
                <h4 className="ps-5">Profile Update</h4>
              </div>
            </Modal.Header>
            <EditProfile />
          </Modal>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
