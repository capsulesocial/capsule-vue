export default ({ app }, node) => ({
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
  async logout () {
    // Set currentUser to null
    await node.stop()
  },
  forgotPassword (email) {
    return email
  },
  resetPassword (password, passwordConfirmation, resetToken) {
    alert('password reset!')
  },
})
