
  function hexEncode (str) {
    var result = []
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      result.push(hex)
    }
    return result.join('');
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

  async function encryptData (key, data, nonce) {
    const ec = new TextEncoder()
    console.log("dereivedkey", typeof(key), key)

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
      console.log('encrypteddata')
    const encryptedData = await window.crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: nonce,
      tagLength: 128,
    }, derivedKey, ec.encode(data))

    return encryptedData
  }

  async function scrypt(str, salt) {
    const dklen = 8
    var hashedStr
    await import('scrypt-wasm').then((wasm)=>{
      hashedStr = wasm.scrypt(hexEncode(str), hexEncode(salt), 32768, 8, 1, dklen)
    })
    return hashedStr
  }

  async function getEncryptedPeerIDPrivateKey (payload, peerIDPrivateKey, peerIDPublicKey) {
    //HKDF(key: userPassword, info: "CapsuleBlogchainAuth", salt: peerIDPublicKey)
    const hps = await hkdf (payload.password, peerIDPublicKey) 
    const hp = Object.values(hps)
    //peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
    const peerIDEncryptionKey = await scrypt(hp[0], "CapsuleBlogchainAuth-" + payload.id)
    //encryptedPeerIDPrivateKey = AES-GCM(key: peerIDEncryptionKey, plaintext: peerIDPrivateKey, nonce: nonce)
    const nonce = window.crypto.getRandomValues(new Uint8Array(12))
    const encryptedPeerIDPrivateKey = await encryptData(peerIDEncryptionKey, peerIDPrivateKey, nonce)
    return {encryptedPeerIDPrivateKey: encryptedPeerIDPrivateKey, hp1: hp[1], nonce: nonce}

  }

  export {getEncryptedPeerIDPrivateKey}