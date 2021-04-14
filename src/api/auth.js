export default axios => ({
  // POST newly created account to IPFS
  register(payload) {
    console.log(payload)
    // return axios.post("auth/register", payload)
  },
  // Verify login attempt
  login(email, password) {
    let res = null
    console.log(email + " " + password)
    // Returns user object if successful
    // res = axios.post("/auth/login", { email, password })
    return res
  },
  // Ends user session
  logout() {
    return axios.get("/auth/logout")
    // Set currentUser to null
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