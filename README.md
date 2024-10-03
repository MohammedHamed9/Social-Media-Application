# Social Media Application
## Features
- User Authentication: JWT-based login, registration, and password reset.
- User Profiles: Update bio, upload profile pictures, and manage follower relationships.
- Posts & Comments: Users can create posts, comment on others' posts, and like/unlike posts.
- Real-Time Messaging: Users can engage in one-on-one real-time chat.
- Notifications: Real-time notifications for likes, comments, follows, and messages.
- Follow/Unfollow Users: Users can follow and unfollow other users.
- Caching : Redis for caching and handling real-time events.
## Technologies
- Backend: Node.js, Express.js, Sequelize ORM (MySQL)
- Real-Time Communication: Socket.IO for WebSocket implementation
- Database: MySQL
- Cache & Pub/Sub: Redis
- Authentication: JWT (JSON Web Tokens)
- Containerization: Docker
## Getting Started
 ### Prerequisites
 Before running this project, make sure you have installed:
 - Node.js
 - MySQL (or use Docker)
 - XAMPP for running MySQL
 - Docker (optional for containerization)
## Database Models
  ### User Model
- Fields: id, username, email, password, profile_picture, bio, createdAt, updatedAt
- Associations: User.hasMany(Post), User.hasMany(Comment), User.hasMany(Like), User.belongsToMany(User, { as: 'Followers' })
  ### Posr Model
- Fields: id, content, userId, image_url, createdAt, updatedAt
- Associations: Post.belongsTo(User), Post.hasMany(Comment), Post.hasMany(Like)
  ### Like Model
- Fields: id, PostId, UserId
- Associations: Like.belongsTo(Post),Like.belongsTo(User)
  ### Comment Model
- Fields: id, content, PostId, UserId, createdAt, updatedAt
- Associations: Comment.belongsTo(Post),Comment.belongsTo(User)
  ### Message  Model
- Fields: id, content, senderId, receiverId, createdAt, read_status
- Associations: Message.belongsTo(User, { as: 'Sender' }), Message.belongsTo(User, { as: 'Receiver' })
  ### userFollowers  Model
- Fields: id, followerId, followingId 
- Associations: userFollowers.belongsTo(User,{as:'followers',foreignKey:'followerId'} userFollowers.belongsTo(User,{as:'following',foreignKey:'followingId'})
  ### Notification  Model
- Fields: id, type, message, read_status, UserId, createdAt, updatedAt 
- Associations: Notification.belongsTo(User,{foreignKey:'UserId'} )
  

