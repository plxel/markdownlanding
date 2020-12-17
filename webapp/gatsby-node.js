/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const result = await graphql(`
    query {
      mdlapi {
        allPages {
          id
          name
          content
          userId
        }
      }
    }
  `)
  result.data.mdlapi.allPages.forEach(({ id, userId, name, content }) => {
    const landingPagePath = path.resolve("./src/pages/landingPage.js");
    actions.createPage({
      path: `/pages/${id}`,
      component: landingPagePath,
      context: { id, name, content, userId }
    })
  });

  return true;
}