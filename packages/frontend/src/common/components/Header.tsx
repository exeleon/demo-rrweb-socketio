import { styled } from "@mui/material";

const Header = styled("header")(() => ({
  height: 50,
  paddingLeft: 16,
  paddingRight: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  boxShadow: "0px -6px 10px 2px rgba(0, 0, 0, .6);",
}));

export default Header;
