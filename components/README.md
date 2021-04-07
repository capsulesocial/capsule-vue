# COMPONENT CATALOG

### **/post/Card**

#### _Props_

- post: takes in the post object. Required for displaying title, subtitle, views, timestamp. Modifies the likes and comments arrays
- authorID: Used for creating the link to route to the author's profile.
- authorUsername: Used to display the author's username on the card.

#### _Methods_

- handleHeart: Checks if user _hearts_ this post by the author
- handleComment: (internal state) Toggles comment box below post
- handleShare: TBD
- sendComment: Updates the array of comments on a user's post
