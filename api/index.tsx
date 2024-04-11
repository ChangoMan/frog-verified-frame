import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { serveStatic } from 'frog/serve-static'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  basePath: '/api',
  // Supply a Hub API URL to enable frame verification.
  hub: pinata(),
}).use(
  neynar({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  })
)

app.frame('/', (c) => {
  const { status, frameData, verified } = c

  const { fid } = frameData || {}

  const { displayName, followerCount, pfpUrl } = c.var.interactor || {}

  console.log('verified', verified)
  console.log('displayName', displayName)
  console.log('followerCount', followerCount)
  console.log('pfpUrl', pfpUrl)
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response' ? `Hello ${fid}` : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      <Button value="apples">Apples</Button>,
      <Button action="/neynar">Neynar</Button>,
    ],
  })
})

app.frame('/neynar', (c) => {
  const { displayName, followerCount, pfpUrl } = c.var.interactor || {}
  console.log('interactor: ', c.var.interactor)

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 28,
          fontSize: 48,
          height: '100%',
          width: '100%',
        }}
      >
        Greetings {displayName}, you have {followerCount} followers.
        <img
          style={{
            width: 200,
            height: 200,
          }}
          src={pfpUrl}
        />
      </div>
    ),
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
