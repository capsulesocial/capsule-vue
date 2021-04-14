export default axios => ({
  // Verify login attempt
  login(email, password) {
    // Returns user object if successful
    // return axios.post("/auth/login", { email, password })
    // Set user session
  },
  // Ends user session
  logout() {
    return axios.get("/auth/logout")
    // Set currentUser to null
  },
  // POST newly created account to IPFS
  register(payload) {
    return axios.post("auth/register", payload)
  },
  forgotPassword(email) {
    return axios.post("/auth/password/forgot", { email })
  },
  resetPassword(password, passwordConfirmation, resetToken) {
    return axios.post("/auth/password/reset", {
      password: password,
      passwordConfirmation: passwordConfirmation,
      token: resetToken
    })
  }
});