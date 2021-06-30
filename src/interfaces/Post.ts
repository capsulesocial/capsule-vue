import { Tag } from '@/interfaces/Tag'

export interface Post {
  id: string,
  authorID: string,
  authorCID: string,
  title: string,
  subtitle: string,
  content: string,
  featuredPhotoCID: string,
  tags: Tag[],
  timestamp: Date,
  comments: any[],
  bookmarks: string[],

}