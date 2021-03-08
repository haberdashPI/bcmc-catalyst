/** @jsx jsx */
import { jsx } from "theme-ui"
import { useContext } from "react"
import { NavContext } from "gatsby-theme-catalyst-core"

const NavLi = ({ children, hasSubmenu, linkKind }) => {
  const [isNavOpen] = useContext(NavContext)
  const suffix =
    linkKind === "primary" ? "Primary" :
    linkKind === "secondary" ? "Secondary" : ""
  return (
    <li
      sx={{
        my: [2, null, 0, null, null],
        mr: [0, null, 3, null, null],
        cursor: "pointer",
        ".active": {
          textDecoration: "underline",
          textDecorationThickness: "0.125em",
          color: "primary",
          variant: "variants.navLinkActive"+suffix,
        },
        a: {
          position: "relative",
          py: 2,
          px: 1,
          color: isNavOpen ? "header.textOpen" : "header.text",
          textDecoration: "none",
          fontWeight: "bold",
          letterSpacing: "1px",
          zIndex: 2,
          ":hover, :focus, :active": {
            textDecoration: "underline",
            textDecorationThickness: "0.125em",
            color: "primary",
          },
          variant: "variants.navLink"+suffix,
        },

        variant: "variants.navLi"+suffix
      }}
    >
      {children}
    </li>
  )
}

export default NavLi
