# PowerShell Rangers - Back End

---

### Users Table

| Method | Path       | Additional Info | Result            | Response |
| ------ | ---------- | --------------- | ----------------- | -------- |
| GET    | /users/    |                 | get all users     |          |
| POST   | /users/    | req.body        | create user       |          |
| GET    | /users/:id |                 | find user by id   |          |
| PUT    | /users/:id | :id             | update user by id |          |
| DELETE | /users/:id | :id             | delete user by id |          |

---

### Meetings Table

| Method | Path                | Additional Info            | Result                             | Response |
| ------ | ------------------- | -------------------------- | ---------------------------------- | -------- |
| POST   | /meetings/          | req.body                   | add meeting to db                  |          |
| GET    | /meetings/getall    | -                          | get all meetings                   |          |
| GET    | /meetings/getByDate | req.query.meetingStartTime | get all meetings on a certain date |          |
| GET    | /meetings/id        | req.query.id               | get meeting by id                  |          |
| PUT    | /meetings/id        | req.query.id               | update meeting by id               |          |
| DELETE | /meetings/id        | req.query.id               | delete meeting by id               |          |

---

### Websockets

| Method  | Path     | Additional Info               | Result                                               | Response |
| ------- | -------- | ----------------------------- | ---------------------------------------------------- | -------- |
| CONNECT | /sockets | socket.handshake.query.roomID | connect to websocket server                          |          |
| POST    | /sockets | socket.handshake.query.roomID | post message, broadcast to everyone in the same room |          |
