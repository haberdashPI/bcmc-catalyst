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
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "0.5rem",
        letterSpacing: "normal",
          cursor: "pointer",
        ".active": {
          textDecoration: "none",
          textDecorationThickness: "0.125em",
          color: "inherit",
          variant: "variants.navLinkActive"+suffix,
        },
        a: {
          position: "relative",
          fontFamily: "body",
          fontWeight: "normal",
          py: "0.5em",
          px: "0.5em",
          color: isNavOpen ? "header.textOpen" : "header.text",
          textDecoration: "none",
          letterSpacing: "spacing",
          zIndex: 2,
          ":hover, :focus, :active": {
            textDecoration: "none",
            textDecorationThickness: "0.125em",
            color: "primary",
          },
          variant: "variants.navLink"+suffix,
        },

        variant: "variants.navLi"+suffix,
    }}
    >
      {children}
    </li>
  )
}

export default NavLi
