import type { Plugin } from '@nuxt/types'
import { Post } from '~/interfaces/Post'
const IPFS = require('ipfs')

declare module 'vue/types/vue' {
  interface Vue {
    $sendProfile: sender,
    $getProfile: getter,
    $sendPost: sender,
    $getPost: getter,
    $getPhoto: getter,
    $sendPhoto: sender,
  }
}

type sender = (content: any) => Promise<string>
type getter = (cid: string) => Promise<any>

const ipfsPlugin: Plugin = async(_context, inject) => {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('IPFS version: ', version.version)    
  
  // Send a user profile object to IPFS
  const sendProfile: sender = async (content) => {
    const profileAdded = await node.add({
      path: content.id,
      content: JSON.stringify(content)
    })
    const cid = profileAdded.cid.string
    return cid
  }

    // Returns post object associated with content id
    const getProfile: getter = async (cid) => {
      let content: string = ''
      for await (const chunk of node.cat(cid)) {
        content += chunk.toString()
      }
      return JSON.parse(content)
    }

  // Send post to IPFS
  const sendPost: sender = async (content: Post) => {
    const postAdded = await node.add({
      path: content.title,
      content: JSON.stringify(content)
    })
    const cid = postAdded.cid.string
    return cid
  }

    // Returns post object associated with content id
    const getPost: getter = async (cid) => {
      let content: string = ''
      for await (const chunk of node.cat(cid)) {
        content += chunk.toString()
      }
      return JSON.parse(content)
    }

  // Add photo to IPFS
  const sendPhoto: sender = async (content) => {
    const photoAdded = await node.add(content)
    const cid = photoAdded.cid.string
    console.log('Photo CID:', cid)
    return cid
  }

  // Get photo
  const getPhoto: getter = async (cid) => {
    if (cid === null || cid === '') return
    let content = ''
    for await (const chunk of node.cat(cid)) {
      content += chunk.toString()
    }
    return content
  }
    
  inject('sendProfile', sendProfile)
  inject('sendPost', sendPost)
  inject('getPost', getPost)
  inject('sendPhoto', sendPhoto)
  inject('getPhoto', getPhoto)
  inject('getProfile', getProfile)
}

export default ipfsPlugin