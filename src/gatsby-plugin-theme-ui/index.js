import { merge } from "theme-ui"
import { BaseTheme } from "gatsby-theme-catalyst-core"
import { tailwind, baseColors } from "@theme-ui/preset-tailwind"

export default merge(BaseTheme, {
  // Modifications to the base theme go here. This is an example changing colors and using variants to change your navigation links. Uncomment the code below to see what happens.
  fonts: {
    ...tailwind.fonts,
    body:
      'Raleway,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans",Helvetica,sans-serif',
    heading: '"EB Garamond",Times',
    monospace:
      'Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
  },
  colors: {
    ...tailwind.colors,
    background: baseColors.gray[1], //Try "#954264",
    text: baseColors.gray[8],
    textGray: "#6e6e6e",
    primary: "#498046",
    secondary: "#d5b959",
    tertiary: "#c45b4a",
    accent: baseColors.orange[2],
    highlight: baseColors.orange[5],
    muted: baseColors.gray[2],
    header: {
      background: "#222",
      backgroundOpen: baseColors.blue[2],
      text: "#eee",
      textOpen: baseColors.gray[8],
      icons: "#eee",
      iconsOpen: baseColors.gray[8],
    },
    footer: {
      background: "#444",
      text: "#eee",
      links: "#eee",
      icons: "#eee"
    },
    // You can delete dark mode by removing the "modes" object and setting useColorMode to false in gatsby-theme-catalyst-core
    modes: {
      dark: {
        background: "#222",
        text: baseColors.gray[1],
        textGray: "#666",
        primary: "#498046",
        secondary: baseColors.orange[7],
        accent: baseColors.gray[8],
        highlight: baseColors.orange[5],
        muted: baseColors.gray[8],
        header: {
          text: baseColors.gray[1],
          textOpen: baseColors.gray[1],
          background: "#333",
          backgroundOpen: baseColors.gray[8],
          icons: baseColors.gray[1],
          iconsOpen: baseColors.gray[1],
        },
        footer: {
          background: "#444",
          text: baseColors.gray[1],
          links: baseColors.gray[1],
          icons: baseColors.gray[1],
        },
      },
    },
  },
  variants: {
    siteTitle: {
      fontSize: [1, 2, null, 3, null],
      fontFamily: "body",
      fontWeight: "normal",
    },
    navLink: {
      fontFamily: "body",
      fontWeight: "normal",
      px: "0.5em",
      py: "0.5em",
    },
    navLinkPrimary: {
      fontFamily: "body",
      fontWeight: "normal",
      px: "0.5em",
      py: "0.5em",
    },
    navLinkSecondary: {
      fontFamily: "body",
      fontWeight: "normal",
      color: "#d5b959",
      px: "0.5em",
      py: "0.5em",
    },

    navLinksDropdown: {
      fontFamily: "body",
      fontWeight: "normal",
      letterSpacing: "normal",
      px: "0.5em",
      py: "1px",
    },

    navLi: {
      borderWidth: "2px",
      borderStyle: "solid",
      borderRadius: "0.5rem",
      letterSpacing: "normal",
    },
    navLiPrimary: {
      borderWidth: "2px",
      borderStyle: "solid",
      borderRadius: "0.5rem",
      background: "#c45b4a",
      borderColor: "#c45b4a",
    },
    navLiSecondary: {
      borderWidth: "2px",
      borderStyle: "solid",
      borderRadius: "0.5rem",
      borderColor: "#d5b959",
    }
  },
})
