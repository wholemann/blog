// @flow strict
import { useStaticQuery, graphql } from 'gatsby';

const useWikiList = () => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      query WikiListQuery {
        allMarkdownRemark(filter: {frontmatter: {template: {eq: "wiki"}, draft: {ne: true}}}) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
              parent {
                ... on File {
                  modifiedTime
                  mtime(difference: "milliseconds")
                }
              }
            }
          }
        }
      }
    `
  );

  return allMarkdownRemark;
};

export default useWikiList;
