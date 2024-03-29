/** @jsx jsx */
import { jsx } from "theme-ui"
import { Fragment, useContext, useState } from "react"
import { Link } from "gatsby"
import { useSiteMetadata, NavContext } from "gatsby-theme-catalyst-core"
import DropdownButton from "gatsby-theme-catalyst-header-top/src/components/dropdown-button"
import DropdownMenu from "gatsby-theme-catalyst-header-top/src/components/dropdown-menu"

// This component has a lot going on. It is handling the mapping of the menu items, optionally using anchor links, and optionally showing a dropdown menu. It is broken into smaller components for readability here but could be condensed into one mega component if you wanted.

const NavLinksLeft = () => {
  const { menuLinks } = useSiteMetadata()
  const leftLinks = menuLinks.filter((link) => link.location === "left")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isNavOpen, setIsNavOpen] = useContext(NavContext) // eslint-disable-line

  const primaryLink = leftLinks.length-1;
  const secondaryLink = leftLinks.length-2;

  return (
    <ul
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "flex",
        flexDirection: ["column", null, "row", null, null],
        alignItems: "center",
        flexWrap: "wrap",
        variant: "variants.navLinksLeft",
      }}
    >
      {leftLinks.map((link) => {
        const hasSubmenu = link.subMenu && link.subMenu.length > 0
        return (
          <li
            key={link.link}
            sx={{
              my: [2, null, 0, null, null],
              mr: [1, null, 3, null, null],
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "0.5rem",
              letterSpacing: "normal",
              fontWeight: "normal",
              cursor: "pointer",
              ".active": {
                textDecoration: "none",
                textDecorationThickness: "0.125em",
                color: "primary",
                variant: "variants.navLinkActive",
              },
              variant: "variants.navLi",
            }}
          >
            {!hasSubmenu && (
              <Link
                to={link.link}
                activeClassName="active"
                onClick={() => setIsNavOpen(false)}
                sx={{
                  position: "relative",
                  fontFamily: "body",
                  fontWeight: "normal",
                  py: "0.5em",
                  px: "0.5em",
                  color: isNavOpen ? "header.textOpen" : "header.text",
                  textDecoration: "none",
                  fontWeight: "bold",
                  letterSpacing: "spacing",
                  zIndex: 2,
                  ":hover, :focus, :active": {
                    textDecoration: "none",
                    textDecorationThickness: "0.125em",
                    color: "primary",
                  },
                  variant: "variants.navLink",
                }}
              >
                {link.name}
              </Link>
            )}
            {hasSubmenu && (
              <Fragment>
                <DropdownButton
                  link={link.link}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                >
                  {link.name}
                </DropdownButton>
                {activeDropdown === link.link && (
                  <DropdownMenu
                    link={link}
                    setActiveDropdown={setActiveDropdown}
                    activeDropdown={activeDropdown}
                  />
                )}
              </Fragment>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default NavLinksLeft
