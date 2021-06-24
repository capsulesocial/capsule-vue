import Auth from '@/api/auth.vue'
import Post from '@/api/post.vue'
import Profile from '@/api/profile.vue'
import Settings from '@/api/settings.vue'
import Authors from '@/api/authors.vue'
const IPFS = require('ipfs')

export default async (context, inject) => {
  const node = await IPFS.create()
  const version = await node.version()
  console.log('IPFS version: ', version.version)

  // Initialize API factories
  const factories = {
    auth: Auth(context, node),
    post: Post(context, node),
    profile: Profile(context, node),
    settings: Settings(context, node),
    authors: Authors(context, node),
  }

  // Inject $api
  inject('api', factories)
}
