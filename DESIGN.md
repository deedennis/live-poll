## System Design for LivePoll

#### 1. **Features**
   - **User Authentication:** Users can log in, create polls, and vote. Authenticated users can bookmark polls.
   - **Create Polls:** Users can create polls with options for others to vote on.
   - **Real-Time Voting & Visualization:** Live updates for ongoing polls and dynamic visualizations using charts.
   - **Bookmark Polls:** Users can bookmark polls to view or participate in later.
   - **View Past Participation:** A history of polls the user participated in.

#### 2. **Frontend (React)**

   - **React Components**:
      - **Login/Register Page:** For user authentication.
      - **Dashboard:** Displays polls created by the user and polls they bookmarked.
      - **Poll Creation Page:** Allows users to create a new poll with title, description, and options.
      - **Poll Display Page:** Shows the poll with voting options, live updates on votes, and a visualization of the voting progress (e.g., bar chart or pie chart).
      - **Bookmarks Page:** Displays a list of bookmarked polls.
   
   - **Real-Time Voting Updates**:
      - Use **Socket.io** or **WebSockets** to enable real-time updates. When a user votes, the data is sent to the server and then broadcast to other connected clients, updating the visualization immediately.

#### 3. **Backend (Node.js + Express)**

   - **API Endpoints**:
      - **Auth Routes**:
         - `POST /api/auth/register`: User registration.
         - `POST /api/auth/login`: User login.
      - **Poll Routes**:
         - `POST /api/polls`: Create a new poll.
         - `GET /api/polls/:pollId`: Get poll details, including live vote count.
         - `POST /api/polls/:pollId/vote`: Submit a vote for a poll.
         - `GET /api/polls/bookmarked`: Retrieve all bookmarked polls for a user.
         - `POST /api/polls/:pollId/bookmark`: Bookmark a poll.
      - **User Routes**:
         - `GET /api/user/history`: Get a list of polls the user has participated in.
   
   - **Real-Time Updates**:
      - **Socket.io**: When a vote is cast, the server broadcasts the updated vote count to all connected clients subscribed to that poll. This ensures real-time updates on each client.

#### 4. **Database (MongoDB)**

   - **Collections**:
      - **Users**: Stores user information, bookmarks, and participated polls.
      - **Polls**: Contains details of each poll, options, votes, and the creator’s user ID.
      - **Votes**: Each document records a vote with a user ID, poll ID, and option ID.
      - **Bookmarks**: Stores references to polls a user has bookmarked.

   - **Schema Design**:
      - **User Schema**:
         ```javascript
         {
            _id: ObjectId,
            username: String,
            password: String, // hashed
            bookmarks: [pollId],
            history: [pollId]
         }
         ```
      - **Poll Schema**:
         ```javascript
         {
            _id: ObjectId,
            title: String,
            description: String,
            options: [
               { optionId: ObjectId, text: String, voteCount: Number }
            ],
            creatorId: ObjectId,
            createdAt: Date
         }
         ```
      - **Vote Schema**:
         ```javascript
         {
            _id: ObjectId,
            userId: ObjectId,
            pollId: ObjectId,
            optionId: ObjectId
         }
         ```

#### 5. **Real-Time Voting with Socket.io**

   - **Workflow**:
      - When a user votes on a poll, the frontend triggers a `vote` event via **Socket.io**.
      - The server receives this event, updates the vote count in the database, and broadcasts the updated vote count to all clients connected to that poll.
      - This enables real-time visualization as each client receives the updated poll data without refreshing the page.

#### 6. **Chart Visualization**

   - **Frontend Visualization**:
      - Use **Chart.js** or **D3.js** to create charts that display poll results.
      - As Socket.io sends updates, the poll display page refreshes the chart data dynamically, showing live vote changes.

#### 7. **Bookmarking & Poll History**

   - **Bookmarking a Poll**:
      - When a user bookmarks a poll, the poll ID is added to their bookmarks in the `Users` collection.
      - The bookmarks page fetches all polls that match the bookmarked poll IDs and displays them.
   
   - **Poll History**:
      - Each vote by a user is recorded, with the poll ID added to their `history` field in the `Users` collection.
      - This allows users to view past polls they participated in.

   ## Like Feature

   This project supports liking polls. The design below documents the data model, API contract, server-side responsibilities, real-time behavior, frontend considerations, and edge cases.

   ### Purpose
   - Allow authenticated users to like a poll.
   - Prevent duplicate likes by the same user on the same poll.
   - Provide real-time updates of like changes to clients viewing the poll.

   ### Data model
   - Like collection (already implemented in `backend/src/models/like.model.js`):

   ```javascript
   {
      _id: ObjectId,
      pollId: ObjectId, // ref: Poll (required)
      userId: ObjectId, // ref: User (required)
      createdAt: Date,
      updatedAt: Date
   }
   ```

   - Important: the `Like` model has a unique compound index on { pollId, userId } to enforce a single like per user per poll.

   - Poll document (should contain these fields / be updated accordingly):

   ```javascript
   {
      // ...existing fields
      likesCount: Number,      // total likes (default 0)
      likedBy: [ObjectId]      // optional: list of userIds who liked (used for quick lookups)
   }
   ```

   ### API endpoints
   Suggested endpoints (match implementation in `backend/src/routes/v1/like.route.js`):

   - POST /api/v1/polls/:pollId/like
      - Auth required
      - Creates a like for the authenticated user on the poll
      - Response: 201 on success with created Like document

   - DELETE /api/v1/polls/:pollId/like
      - Auth required
      - Removes the authenticated user's like on the poll
      - Response: 200 on success

   - GET /api/v1/polls/:pollId/likes
      - Returns list / count of likes for a poll

   - GET /api/v1/user/likes
      - Returns all polls liked by the authenticated user

   Controller behavior (as implemented in `backend/src/controllers/like.controller.js`):
   - Calls service layer for create/remove/get operations.
   - On successful create/remove, the controller emits a socket.io `like` event to the poll room: `req.io.to(pollId).emit('like', { pollId })`.

   Notes: controller currently emits only the `pollId` in the event payload; consider including additional data (likesCount, userId, action) to reduce an extra fetch on clients.

   ### Server responsibilities
   - Validation: ensure pollId is valid and that an authenticated user is present (middleware `verifyToken`).
   - Deduplication: the unique compound index on Like plus a repo-level check prevents duplicate likes.
   - Atomic updates: service/repo updates both the `Like` collection and the `Poll` document's `likesCount`/`likedBy` fields. Use MongoDB `$inc` and `$addToSet` / `$pull` as implemented in `like.repo.js`.
   - Error handling: convert repository-level conditions (already liked / not liked) into 4xx responses and unexpected errors into 5xx responses.

   ### Real-time behavior (Socket.io)
   - Event name: `like` (existing implementation).
   - Emitted from server to all sockets in the poll room after DB update.
   - Current payload: `{ pollId }`.
   - Recommended enhancement: emit `{ pollId, likesCount, action: 'created'|'removed', userId? }` so clients can update UI without an extra API call.

   Frontend responsibilities
   - Endpoints: call POST/DELETE endpoints while user is authenticated.
   - Optimistic UI: update like count and toggle liked state immediately; roll back on error.
   - Real-time updates: subscribe to socket `like` events for the poll and update like count/UI accordingly.
   - UX: disable the like button while the request is in-flight to prevent duplicate clicks and show a loader for short network waits.

   ### Edge cases and constraints
   - Race condition: two simultaneous like requests by same user — the unique index will keep only one and repo returns an appropriate message; handle this gracefully on client.
   - Deleted polls: ensure likes are cleaned up when polls are removed (a cascade or background cleanup).
   - Privacy: `getPollLikes` should avoid exposing sensitive user fields; use `.populate('userId', 'username')` if needed (current repo populates `username` and `email` for poll likes).

   ### Tests
   - Unit tests for repo/service covering:
      - createLike success
      - createLike when already liked -> returns friendly error
      - removeLike success and when not liked -> friendly error
      - Poll `likesCount` increments/decrements and `likedBy` updates
   - Integration tests for controller endpoints (auth + DB).

   ### Notes / Migration
   - Ensure existing `Poll` schema has `likesCount` (Number, default 0) and `likedBy` (Array of ObjectIds) or adjust repo to avoid those fields.
   - If migrating an existing dataset, run a script to populate `likesCount` from `Like` collection counts.

   ### System Diagram

A basic diagram for this system would include:

1. **Frontend (React)**: Login/Register Page, Dashboard, Poll Creation Page, Poll Display Page with charts, Bookmark and History pages.
2. **Backend (Express)**: API endpoints for user actions (vote, create poll, bookmark), real-time voting handled by Socket.io.
3. **Database (MongoDB)**: Stores collections for users, polls, votes, and bookmarks.
4. **Socket.io/WebSocket**: Handles real-time updates from the server to the clients as votes come in.