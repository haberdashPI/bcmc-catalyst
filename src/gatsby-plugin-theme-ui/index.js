import { merge } from "theme-ui"
import { BaseTheme } from "gatsby-theme-catalyst-core"
import { tailwind, baseColors } from "@theme-ui/preset-tailwind"
import "@fontsource/eb-garamond/400.css"
import "@fontsource/eb-garamond/700.css"
import "@fontsource/raleway/400.css"
import "@fontsource/raleway/700.css"
import { darken, lighten } from "@theme-ui/color"

export const theme = {
  primary: "#498046",
  secondary: "#80c180",
  tertiary: "#d5b959",
}

export default merge(BaseTheme, {
  breakpoints: ["480px", "768px", "1024px", "1440px"],
  fonts: {
    ...tailwind.fonts,
    body:
      'Raleway,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans",Helvetica,sans-serif',
    heading: '"EB Garamond",Times',
    monospace:
      'Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
  },
  sizes: {
    maxContentWidth: "900px", // Sets the container size on larger screens, e.g. tablets and laptops
  },
  colors: {
    ...tailwind.colors,
    background: baseColors.gray[1], //Try "#954264",
    text: baseColors.gray[8],
    textGray: "#6e6e6e",
    ...theme,
    accent: baseColors.orange[2],
    highlight: baseColors.orange[5],
    muted: baseColors.gray[2],
    header: {
      background: "#333",
      backgroundOpen: "#333",
      text: "#eee",
      textOpen: "#eee",
      icons: "#eee",
      iconsOpen: "#eee"
    },
    footer: {
      background: "#444",
      text: "#eee",
      links: "#eee",
      icons: "#eee"
    },
    // You can delete dark mode by removing the "modes" object and setting useColorMode to false in gatsby-theme-catalyst-core
    // modes: {
    //   dark: {
    //     background: "#334832",
    //     text: baseColors.gray[1],
    //     textGray: "#666",
    //     ...theme,
    //     accent: baseColors.gray[8],
    //     highlight: baseColors.orange[5],
    //     muted: baseColors.gray[8],
    //     header: {
    //       text: baseColors.gray[1],
    //       textOpen: baseColors.gray[1],
    //       background: "#333",
    //       backgroundOpen: baseColors.gray[8],
    //       icons: baseColors.gray[1],
    //       iconsOpen: baseColors.gray[1],
    //     },
    //     footer: {
    //       background: "#444",
    //       text: baseColors.gray[1],
    //       links: baseColors.gray[1],
    //       icons: baseColors.gray[1],
    //     },
    //   },
    // },
  },
  buttonLink: {
    primary: { color: "white" },
    secondary: { color: "black" },
    tertiary: { color: "black" }
  },
  buttons: {
    close: {
      m: "0", p: "0", boxShadow: "none", width: "2rem", height: "2rem"
    },
    primary: {
      color: "white",
      bg: theme.primary,
      boxShadow: "2px 2px 3px black",
      // ":active": { position: "relative", top: "2px", left: "2px", boxShadow: "0px 0px black" },
      ":disabled": { bg: lighten(theme.primary,0.25), boxShadow: "0px 0px black" },
      },
    secondary: {
      color: "black",
      bg: theme.secondary,
      boxShadow: "2px 2px 3px black",
      // ":active": { position: "relative", top: "2px", left: "2px", boxShadow: "0px 0px black" },
      ":disabled": { bg: lighten(theme.primary,0.25), boxShadow: "0px 0px black" },
      },
    tertiary: {
      color: "black",
      bg: theme.tertiary,
      boxShadow: "2px 2px 3px black",
      // ":active": { position: "relative", top: "2px", left: "2px", boxShadow: "0px 0px black" },
      ":disabled": { bg: lighten(theme.primary,0.25), boxShadow: "0px 0px black" },
      },

    dropdown: {
      fontFamily: "body",
      fontWeight: "normal",
      letterSpacing: "normal",
      cursor: "pointer",
      backgroundColor: "header.background",
      text: "header.text",
      fontWeight: "bold",
      px: "0.5em",
      py: "1px",
      ":hover, :focus, :active": {
        textDecoration: "none",
        textDecorationThickness: "0.125em",
        color: "primary",
      },
    }
  },
  variants: {
    formValidation: {
      color: darken(theme.tertiary, 0.2),
      fontWeight: "bold",
      fontSize: "1rem",
      height: "1rem",
    },
    formError: {
      bg: theme.tertiary
    },
    main: {
      my: 0
    },
    siteTitle: {
      fontSize: [1, 1, null, 2, null],
      fontFamily: "body",
      fontWeight: "normal",
    },
    navLinkActive: { color: theme.primary },
    navLinkPrimary: {
      ":hover, :focus, :active": {
        color: theme.primary,
      }
    },
    navLinkActivePrimary: { color: theme.primary },
    navLinkSecondary: {
      color: theme.secondary,
      ":hover, :focus, :active": {
        color: "white",
      }
    },
    navLinkActiveSecondary: { color: "white" },

    navLinksDropdown: {
      fontFamily: "body",
      fontWeight: "normal",
      letterSpacing: "normal",
      px: "0.5em",
      py: "1px",
    },

    branding: {
      width: "300px"
    },

    navLi: {
      borderColor: "transparent",
      fontSize: [1, 1, null, 2, null]
    },
    navLiPrimary: {
      background: theme.tertiary,
      borderColor: theme.tertiary,
      fontSize: [1, 1, null, 2, null]
    },
    navLiSecondary: {
      borderColor: theme.secondary,
      fontSize: [1, 1, null, 2, null]
    },
    heroTitle: {
      fontSize: [4, 5, null, 6, null],
      fontFamily: "body",
      color: "#eee"
    },
    heroContent: {
      color: "#eee"
    },
  },
})
