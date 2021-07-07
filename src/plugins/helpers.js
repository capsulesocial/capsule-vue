export default ({ app }, inject) => {
  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  function getFormat (date, preformattedDate = false, hideYear = false) {
    const day = date.getDate()
    const month = MONTH_NAMES[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours()
    let minutes = date.getMinutes()

    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${minutes}`
    }
    if (preformattedDate) {
      // Today at 4:20
      return `${preformattedDate} at ${hours}:${minutes}`
    }
    if (hideYear) {
      return `${day}. ${month} at ${hours}:${minutes}`
    }
    return `${day}. ${month} ${year}. at ${hours}:${minutes}`
  }

  const formatDate = (input) => {
    if (!input) {
      return null
    }
    const date = typeof input === 'object' ? input : new Date(input)
    const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
    const today = new Date()
    const yesterday = new Date(today - DAY_IN_MS)
    const seconds = Math.round((today - date) / 1000)
    const minutes = Math.round(seconds / 60)
    const isToday = today.toDateString() === date
    const isYesterday = yesterday.toDateString() === date.toDateString()
    const isThisYear = today.getFullYear() === date.getFullYear()

    if (seconds < 5) {
      return 'now'
    } else if (seconds < 60) {
      return `${seconds} seconds ago`
    } else if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (isToday) {
      return getFormat(date, 'Today')
    } else if (isYesterday) {
      return getFormat(date, 'Yesterday')
    } else if (isThisYear) {
      return getFormat(date, false, true)
    }
    return getFormat(date)
  }

  async function hkdf (password, peerIDPublicKey) {
    const ec = new TextEncoder()

    const key = await window.crypto.subtle.importKey(
      'raw',
      ec.encode(password),
      'HKDF',
      false,
      [
        'deriveBits',
        'deriveKey',
      ],
    )

    const derivedKey = await window.crypto.subtle.deriveBits({
      name: 'HKDF',
      hash: 'SHA-256',
      info: ec.encode('CapsuleBlogchainAuth'),
      salt: ec.encode(peerIDPublicKey),
    }, key, 512)

    const keyval = new Uint8Array(derivedKey)
    const hexval = Buffer.from(keyval).toString('hex')

    return {
      hp0: hexval.slice(0, 64),
      hp1: hexval.slice(64),
    }
  }

  async function encryptData (key, data) {
    const ec = new TextEncoder()
    const nonce = window.crypto.getRandomValues(new Uint8Array(12))

    const derivedKey = await window.crypto.subtle.importKey(
      'raw',
      ec.encode(key),
      { name: 'AES-GCM' },
      false,
      [
        'encrypt',
        'decrypt',
      ],
    )

    const encryptedData = await window.crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: nonce,
      tagLength: 128,
    }, derivedKey, ec.encode(data))

    return encryptedData
  }

  const helpers = {
    formatDate,
    hkdf,
    encryptData,
  }
  inject('helpers', helpers)
}
