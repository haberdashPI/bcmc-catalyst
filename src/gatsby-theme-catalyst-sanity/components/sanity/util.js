import { useStaticQuery, graphql, Link } from "gatsby"

export function useSlugIndex(){
    const result = useStaticQuery(graphql`
    query PageSlugQuery {
        allSanityPage {
            nodes {
                _rawSlug
                _id
            }
        }
    }
    `)
    var slugs = {}
    result.allSanityPage.nodes.forEach(node => {
        slugs[node._id] = node._rawSlug.current.replace(/^\/*/, `/`)
    })

    return slugs
}
