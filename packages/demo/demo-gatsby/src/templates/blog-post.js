import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { toMarkdownString } from "@forestryio/gatsby-plugin-xeditor"
import { useCMS } from "@forestryio/cms-react"
import { relative } from "path"
import { RemarkForm } from "@forestryio/gatsby-xeditor-remark"

function BlogPostTemplate(props) {
  const staticPost = props.data.markdownRemark
  const siteTitle = props.data.site.siteMetadata.title
  const { previous, next } = props.pageContext

  let cms = useCMS()
  let filepath = relative(
    "/home/dj/Forestry/cms/packages/demo/demo-gatsby/",
    staticPost.fileAbsolutePath
  )

  return (
    <RemarkForm
      remark={staticPost}
      render={({ markdownRemark }) => {
        let post = markdownRemark
        return (
          <Layout location={props.location} title={siteTitle}>
            <SEO
              title={post.frontmatter.title}
              description={post.frontmatter.description || post.excerpt}
            />
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              {post.frontmatter.title}
            </h1>
            <button onClick={() => cms.api.gitlab.authorize()}>Login</button>
            <button
              onClick={() =>
                cms.api.gitlab.onSubmit({
                  path: filepath,
                  contents: toMarkdownString(post),
                })
              }
            >
              Save
            </button>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: props.data.markdownRemark.html,
              }}
            />
            <hr
              style={{
                marginBottom: rhythm(1),
              }}
            />
            <Bio />

            <ul
              style={{
                display: `flex`,
                flexWrap: `wrap`,
                justifyContent: `space-between`,
                listStyle: `none`,
                padding: 0,
              }}
            >
              <li>
                {previous && (
                  <Link to={previous.fields.slug} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title} →
                  </Link>
                )}
              </li>
            </ul>
          </Layout>
        )
      }}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fileAbsolutePath
      rawMarkdownBody
      frontmatter {
        title
        date
        description
      }
    }
  }
`