export default ({ app }, inject) => {

  const password = function (input) {
    // let reg = /^.*(?=.{8,50})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/
    // return (reg.test(input))
    if (input === "" || input === null) {
      return "Missing password!"
    } else if (input.length < 8) {
      return "Password must be > 8 characters!"
    } else if (input.length > 50) {
      return "Password must be <= 50 characters!"
    } else if (input.search(/\d/) == -1) {
      return "Password must contain a number!"
    } else if (input.search(/[a-zA-Z]/) == -1) {
      return "Password must contain a letter!"
    } else if (input.search(/\s/) != -1) {
      return "Password must not contain a space!"
    }
    else return true
  }

  const id = (input) => {
    if (input === "" || input === null) {
      return "Missing ID!"
    } else if (input.length < 3) {
      return "ID must be > 3 characters"
    } else if (input.length > 25) {
      return "ID must be <= 25 characters"
    } else if (input.search(/\s/) != -1) {
      return "ID must not contain a space!"
    } else if (!/^[a-zA-Z]+$/.test(input)) {
      return "ID must only contain letters"
    }
    else return true
  }

  const qualityRules = {
    password: password,
    id: id
  }
  inject('quality', qualityRules)
}