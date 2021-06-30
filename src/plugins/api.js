import Auth from '@/api/auth'
import Post from '@/api/post'
import Profile from '@/api/profile'
import Settings from '@/api/settings'
import Authors from '@/api/authors'
const IPFS = require('ipfs')

export default async (context, inject) => {
  // const node = await IPFS.create()
  // const version = await node.version()
  // console.log('IPFS version: ', version.version)

  // // Initialize API factories
  // const factories = {
  //   auth: Auth(context, node),
  //   post: Post(context, node),
  //   profile: Profile(context, node),
  //   settings: Settings(context, node),
  //   authors: Authors(context, node),
  // }

  // // Inject $api
  // inject('api', factories)
}
