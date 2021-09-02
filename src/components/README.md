# COMPONENT CATALOG

### **/post/Actions**

Used in:

- /\_id/\_post
- /components/post/Card

#### _Props_

- post: takes in the post object. Required for displaying title, views, timestamp. Modifies the likes and comments arrays
- authorID: Used for creating the link to route to the author's profile.

#### _Methods_

- handleBookmark: Checks if user _bookmarked_ this post by the author
- handleComment: (internal state) Toggles comment box below post
- handleShare: TBD
- sendComment: Updates the array of comments on a user's post
