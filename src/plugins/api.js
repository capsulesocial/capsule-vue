import Auth from "@/api/auth"
import Post from "@/api/post"
import Profile from "@/api/profile"
import Settings from "@/api/settings"

export default (context, inject) => {
  // Initialize API factories
  const factories = {
    auth: Auth(context.$axios),
    post: Post(context.$axios),
    profile: Profile(context.$axios),
    settings: Settings(context.$axios)
  }

  // Inject $api
  inject("api", factories);
}