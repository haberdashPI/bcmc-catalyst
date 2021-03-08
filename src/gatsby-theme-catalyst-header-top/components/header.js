/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui"
import { useContext } from "react"
// import { Branding, Nav, MobileButton } from "gatsby-theme-catalyst-header-top"
import Branding from "gatsby-theme-catalyst-header-top/src/components/branding/branding"
import Nav from "gatsby-theme-catalyst-header-top/src/components/navbar/nav"
import MobileButton from "gatsby-theme-catalyst-header-top/src/components/navbar/nav-mobile-button"
import { NavContext } from "gatsby-theme-catalyst-core"
import { useCatalystConfig } from "gatsby-theme-catalyst-core"

const SiteHeader = () => {
  const [isNavOpen] = useContext(NavContext)
  const { useStickyHeader } = useCatalystConfig()
  const { theme } = useThemeUI()
  return (
    <header
      sx={{
        boxShadow: "0px 5px 2px #444",
        display: "grid",
        position: useStickyHeader ? "sticky" : "static",
        top: 0,
        width: "100%",
        color: isNavOpen ? "header.textOpen" : "header.text",
        backgroundColor: isNavOpen
          ? "header.backgroundOpen"
          : "header.background",
        gridArea: "header",
        zIndex: "888", // Ensure the header is always on top
        variant: "variants.header",
      }}
      id="header"
    >
      <div
        sx={{
          gridRow: "1 / -1",
          gridColumn: "1 / -1",
          alignSelf: "start",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: [
            theme.sizes.headerHeight + " 1fr",
            null,
            theme.sizes.headerHeight,
            null,
            null,
          ],
          maxWidth: "maxPageWidth",
          width: "100%",
          minHeight: isNavOpen ? "100vh" : "50px",
          m: "0 auto",
          px: [1, null, 4, null, null],
          py: [2, null, 3, null, null],
        }}
      >
        <Branding />
        <Nav />
        <MobileButton />
      </div>
    </header>
  )
}

export default SiteHeader
