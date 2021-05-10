import Auth from '@/api/auth'
import Post from '@/api/post'
import Profile from '@/api/profile'
import Settings from '@/api/settings'

export default (context, inject) => {
  // Initialize API factories
  const factories = {
    auth: Auth(context),
    post: Post(context),
    profile: Profile(context),
    settings: Settings(context),
  }

  // Inject $api
  inject('api', factories)
}
