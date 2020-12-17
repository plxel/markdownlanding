import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Textarea, Button } from 'theme-ui'
import ReactMarkdown from 'react-markdown'
import { useAuth0 } from '@auth0/auth0-react'
import { loadStripe } from '@stripe/stripe-js';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.STRIPE_KEY);

const useLandingPageData = ({ pageContext }) => {
  const { id, name, userId } = pageContext;
  const [pageContent, setPageContent] = useState(pageContext.content)

  const { loading, data } = useQuery(gql`
    query page($id: ID!, $userId: ID!) {
      page(id: $id, userId: $userId) {
        name
        content
        createdAt
      }
    }
  `, { variables: { id, userId } })

  // TODO: handle errors
  const [savePageContent] = useMutation(gql`
    mutation savePage($id: ID!, $userId: ID!, $content: String!) {
      savePage(id: $id, userId: $userId, content: $content) {
        content
        lastUpdatedAt
      }
    }
    `, { variables: { id, userId, content: pageContent } })

  useEffect(() => {
    if (data) {
      setPageContent(data.page.content)
    }
  }, [data])

  return { pageContent, setPageContent, savePageContent } 
}

const LandingPage = ({ pageContext }) => {

  const { name, userId } = pageContext;
  const { pageContent, setPageContent, savePageContent } = useLandingPageData({ pageContext })
  
  const { isAuthenticated, user } = useAuth0()
  
  const deployPage = async () => {
    // trigger stripe checkout
    const stripe = await stripePromise;
    const res = await stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1HzISJGcEddESqInD3HAa1pG', // Replace with the ID of your price
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: window.location.href,
      cancelUrl: window.location.href,
    });

    console.log('result', res);
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.


    // run mutation on server to mark page as deployed
    // tell user how to go there
  }

  const isEditable = isAuthenticated && user.sub === userId



  if (!isEditable) {
    return <div>123
        <ReactMarkdown>
          {pageContent}
        </ReactMarkdown>
    </div>
  }

  return (
    <div>
      Landing page - {name}

      <Textarea value={pageContent} onChange={e => setPageContent(e.target.value)} />
      <Button onClick={() => savePageContent()}>Save</Button>
      <Button ml={2} onClick={() => deployPage()}>Deploy</Button>
      <div>
        <ReactMarkdown>
          {pageContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default LandingPage