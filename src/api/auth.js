export default ({ app }) => ({
  // POST newly created account to IPFS
  register(payload) {
    console.log("API / Auth / register has been called")
    return payload
    // Returns newly created user object
  },
  // Verify login attempt
  login(email, password) {
    console.log("API / Auth / Login has been called")
    let res = null
    // Returns user object if successful
    return res
  },
  // Ends user session
  logout() {
    // Set currentUser to null
  },
  forgotPassword(email) {

  },
  resetPassword(password, passwordConfirmation, resetToken) {

  }
});