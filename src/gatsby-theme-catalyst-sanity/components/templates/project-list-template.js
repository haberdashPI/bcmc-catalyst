/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import { Link } from "gatsby"
import { SEO, Layout } from "gatsby-theme-catalyst-core"
import {
  useSanityConfig,
  SanityThemeProvider,
} from "gatsby-theme-catalyst-sanity"

const ProjectsTemplate = ({ data }) => {
  const projects = data.allSanityProject.nodes
  const {
    sanityProjectPath,
    sanityProjectListTitle,
    sanityDisplayProjectListTitle,
  } = useSanityConfig()
  const rootPath = sanityProjectPath.replace(/\/*$/, `/`) //Ensure trailing slash
  return (
    <SanityThemeProvider>
      <Layout>
        <SEO title={sanityProjectListTitle} />
        {sanityDisplayProjectListTitle && (
          <Styled.h1 sx={{fontVariant: "small-caps"}}>{sanityProjectListTitle}</Styled.h1>
        )}
        {projects.map((project) => (
          <article sx={{ my: 5 }} key={project.id}>
            <Styled.a
              as={Link}
              to={rootPath.concat(project.slug.current.replace(/\/*$/, `/`))}
            >
              <Styled.h2 sx={{fontVariant: "small-caps"}}>{project.title}</Styled.h2>
            </Styled.a>
            <Styled.p>{project.excerpt}</Styled.p>
          </article>
        ))}
      </Layout>
    </SanityThemeProvider>
  )
}

export default ProjectsTemplate
