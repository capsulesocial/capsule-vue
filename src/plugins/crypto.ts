import { Profile, PrivateKey } from '../interfaces/Profile'
import type { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $getEncryptedPeerIDPrivateKey: PrivateKey
  }
}

  async function hkdf (password: string, peerIDPublicKey: string) {
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

  async function encryptData (key: string, data: string, nonce: Uint8Array) {
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

  async function scrypt(str: string, salt: string) {
    const dklen = 8
    var hashedStr = ""
    await import('scrypt-wasm').then((wasm)=>{
      hashedStr = wasm.scrypt(str, salt, 32768, 8, 1, dklen)
    })
    return hashedStr
  }

  async function getEncryptedPeerIDPrivateKey (payload: Profile, peerIDPrivateKey: string, peerIDPublicKey: string) {
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
  // const cryptoPlugin: Plugin = (_context, inject) => {
  //   inject(`getEncryptedPeerIDPrivateKey`, getEncryptedPeerIDPrivateKey)
  // }
  
  // export default cryptoPlugin
