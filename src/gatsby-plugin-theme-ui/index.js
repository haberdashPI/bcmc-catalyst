import { merge } from "theme-ui"
import { BaseTheme } from "gatsby-theme-catalyst-core"
import { tailwind, baseColors } from "@theme-ui/preset-tailwind"

const theme = {
  primary: "#498046",
  secondary: "#80c180",
  tertiary: "#d5b959",
}

export default merge(BaseTheme, {
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
    modes: {
      dark: {
        background: "#222",
        text: baseColors.gray[1],
        textGray: "#666",
        primary: theme.primary,
        secondary: theme.secondary,
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
    main: {
      my: 0
    },
    siteTitle: {
      fontSize: [1, 2, null, 3, null],
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

    navLi: {
      borderColor: "transparent"
    },
    navLiPrimary: {
      background: theme.tertiary,
      borderColor: theme.tertiary,
    },
    navLiSecondary: {
      borderColor: theme.secondary,
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
