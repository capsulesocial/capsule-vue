export default ({ app }) => ({
  // Check if a user ID exists in USERS collection
  checkID (id) {
    return false
  },
  // Adds a post to the user profile posts object
  addPost (id, post) {
    return false
  },
  // Return a public user's profile when visiting someone's page
  getProfile (id) {
    return false
  },
})
