
export interface Comment {
  postID: string,
  authorCID: string,
  authorAvatarCID: string,
  content: string,
  emotion: string,
  timestamp: Date,
  replies: any[],
}
