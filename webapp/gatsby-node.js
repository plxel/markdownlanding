/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require('path');

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  // Only update the `/app` page.
  if (page.path.match(/^\/app/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = '/app/*'; // eslint-disable-line
    // Update the page.
    createPage(page);
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const result = await graphql(`
    query {
      mdlapi {
        allPublishedPages {
          id
          name
          content
          userId
        }
      }
    }
  `);
  result.data.mdlapi.allPublishedPages.forEach(
    ({ id, userId, name, content }) => {
      const landingPagePath = path.resolve('./src/templates/landingPage.js');
      actions.createPage({
        path: `/pages/${id}`,
        component: landingPagePath,
        context: { id, name, content, userId },
      });
    }
  );

  return true;
};
