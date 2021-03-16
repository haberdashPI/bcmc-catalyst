/** @jsx jsx */
import { jsx } from "theme-ui"
import Logo from "gatsby-theme-catalyst-header-top/src/components/branding/branding-logo"
import Title from "gatsby-theme-catalyst-header-top/src/components/branding/branding-title"

const SiteBranding = () => {
  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        ml: 2,
        mr: 2,
        variant: "variants.branding",
        width: "300px"
      }}
    >
      <Logo />
      <Title />
    </div>
  )
}

export default SiteBranding
