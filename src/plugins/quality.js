const zxcvbn = require('zxcvbn')

export default ({ app }, inject) => {
  const password = (input) => {
    // let reg = /^.*(?=.{8,50})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/
    // return (reg.test(input))
    var result = zxcvbn(input)
    if (input === '' || input === null) {
      return 'Missing password!'
    } else if (input.length < 8) {
      return 'Password must be > 8 characters!'
    } else if (input.length > 50) {
      return 'Password must be <= 50 characters!'
    } else if (input.search(/\d/) === -1) {
      return 'Password must contain a number!'
    } else if (input.search(/[a-zA-Z]/) === -1) {
      return 'Password must contain a letter!'
    } else if (input.search(/\s/) !== -1) {
      return 'Password must not contain a space!'
    } else if (result.score < 2) {
      // If password is too weak according to zxcvbn, print warning + the first suggestion
      return 'Password is too weak!\n' + result.feedback.warning + '\n' + result.feedback.suggestions[0]
    } else {
      return true
    }
  }

  const id = (input) => {
    if (input === '' || input === null) {
      return 'Missing ID!'
    } else if (input.length < 3) {
      return 'ID must be > 3 characters'
    } else if (input.length > 25) {
      return 'ID must be <= 25 characters'
    } else if (input.search(/\s/) !== -1) {
      return 'ID must not contain a space!'
    } else if (!/^[a-zA-Z0-9]+$/.test(input)) {
      return 'ID must only contain numbers and letters'
    } else {
      return true
    }
  }

  const email = (input) => {
    if (input === '' || input === null) {
      return 'Missing Email!'
    } else if (!/\S+@\S+\.\S+/.test(input)) {
      return 'Invalid email syntax!'
    } else {
      return true
    }
  }

  const validateURL = (url) => {
    // URL starting with http://, https://, or www.
    const regex = /^((https?:\/\/(www\.)?|www\.)[a-zA-Z0-9][\w+\d+&@\-#/%?=~_|!:,.;+]*)$/gi
    return regex.test(url)
  }

  const text = (input) => {
    return true
  }

  const qualityRules = {
    password,
    id,
    email,
    validateURL,
    text,
  }
  inject('quality', qualityRules)
}
