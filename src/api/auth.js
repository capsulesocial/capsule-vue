export default ({ app }) => ({
  // POST newly created account to IPFS
  register (payload) {
    return payload
    // Returns newly created user object
  },
  // Verify login attempt
  login (email, password) {
    const res = null
    // Returns user object if successful
    return res
  },
  // Ends user session
  logout () {
    // Set currentUser to null
  },
  forgotPassword (email) {
    return email
  },
  resetPassword (password, passwordConfirmation, resetToken) {
    alert('password reset!')
  },
})
