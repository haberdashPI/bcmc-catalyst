require("dotenv").config({ path: `.env` })
module.exports = {
  siteMetadata: {
    title: `Baltimore Community Mediation Cetern Website`,
    description: `A community center for conflict resolution in Baltimore, MD`,
    keywords: [`gatsby`, `theme`, `react`],
    author: `David Little`,
    siteUrl: `https://fervent-ritchie-c19b24.netlify.app/`, //Change to you site address, required for sitemap.xml and robots.txt file among other things
    menuLinks: [
      {
        name: `Page 1`,
        link: `/page-1`,
        type: `internal`, //internal or anchor
      },
    ],
    socialLinks: [
      {
        name: `Email`,
        link: `eric@erichowey.dev`,
        location: `footer`, //Options are "all", "header", "footer"
      },
      {
        name: `Twitter`,
        link: `https://twitter.com/erchwy`,
        location: `header`, //Options are "all", "header", "footer"
      },
      {
        name: `Github`,
        link: `https://www.github.com/ehowey`,
        location: `all`, //Options are "all", "header", "footer"
      },
    ],
  },
  plugins: [
    // {
    //   resolve: 'gatsby-source-mailchimp',
    //   options: {
    //     key: process.env.MAILCHIMP_API_KEY,
    //     rootURL: 'https://us9.api.mailchimp.com/3.0'
    //   }
    // },
    {
      resolve: `gatsby-theme-catalyst-core`,
      options: {
        // Default options are:
        // contentPath: `content/pages`,
        // assetPath: `content/assets`,
        // invertSiteLogo: false,
        useStickyHeader: true,
        // useSocialLinks: true,
        // useColorMode: false, (NO LONGER USED)
        // footerContentLocation: "left", // "left", "right", "center"
        // remarkImagesWidth: 1440,
        // imageQuality: 50,
      },
    },
    {
      resolve: `gatsby-theme-catalyst-header-top`,
      options: {
        useColorMode: false,
      }
    },
    `gatsby-theme-catalyst-footer`,
    {
      resolve: `gatsby-theme-catalyst-sanity`,
      options: {
        // Example for an env variable
        sanityProjectId: process.env.SANITY_PROJECT_ID,
        sanityDataset: process.env.SANITY_DATASET,
        sanityToken: process.env.SANITY_TOKEN,
        //
        // Default options are:
        // sanityDataset: "production"
        // sanityToken: null
        // sanityWatchMode: true
        sanityOverlayDrafts: process.env.SITE_BUILD_MODE !== "production",
        // sanityCreatePages: true
        // sanityCreatePosts: true
        // sanityCreatePostsList: true
        // sanityCreateProjects: true
        // sanityCreateProjectsList: true
        sanityPostPath: "/events",
        sanityProjectPath: "/services",
        sanityPostListTitle: "Events",
        // sanityDisplayPostListTitle: true
        sanityProjectListTitle: "Services",
        // sanityDisplayProjectListTitle: true
        // useSanityTheme: false // Experimental right now
        sanityProjectId: "q16mco74",
      },
    },

    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `baltimore-community-mediation-center`,
        short_name: `bcmc`,
        start_url: `/`,
        background_color: `#222`,
        theme_color: `#498046`,
        display: `minimal-ui`,
        icon: `content/assets/logo_white_simple.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
