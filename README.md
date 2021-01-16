# Pow!Agile - Back End

---

### Users Table

| Method | Path       | Additional Info | Result            |
| ------ | ---------- | --------------- | ----------------- |
| GET    | /users/    |                 | get all users     |
| POST   | /users/    | req.body        | create user       |
| GET    | /users/:id |                 | find user by id   |
| PUT    | /users/:id | :id             | update user by id |
| DELETE | /users/:id | :id             | delete user by id |

---

### STAND UP Meetings Table

| Method | Path                      | Additional Info            | Result                                      |
| ------ | ------------------------- | -------------------------- | ------------------------------------------- |
| POST   | /meetingStandUp/          | req.body                   | add Stand Up meeting to db                  |
| GET    | /meetingStandUp/getAll    | -                          | get all Stand Up meetings                   |
| GET    | /meetingStandUp/getByDate | req.query.meetingStartTime | get all Stand Up meetings on a certain date |
| GET    | /meetingStandUp/id        | req.query.id               | get Stand Up meeting by id                  |
| PUT    | /meetingStandUp/id        | req.query.id               | update Stand Up meeting by id               |
| DELETE | /meetingStandUp/id        | req.query.id               | delete Stand Up meeting by id               |

---

### RETROSPECTIVES Meetings Table

| Method | Path                    | Additional Info            | Result                                   |
| ------ | ----------------------- | -------------------------- | ---------------------------------------- |
| POST   | /meetingRetro/          | req.body                   | add Retro meeting to db                  |
| GET    | /meetingRetro/getAll    | -                          | get all Retro meetings                   |
| GET    | /meetingRetro/getByDate | req.query.meetingStartTime | get all Retro meetings on a certain date |
| GET    | /meetingRetro/id        | req.query.id               | get Retro meeting by id                  |
| PUT    | /meetingRetro/id        | req.query.id               | update Retro meeting by id               |
| DELETE | /meetingRetro/id        | req.query.id               | delete Retro meeting by id               |

---

### Websockets

| Method  | Path     | Additional Info               | Result                                               | Response |
| ------- | -------- | ----------------------------- | ---------------------------------------------------- | -------- |
| CONNECT | /sockets | socket.handshake.query.roomID | connect to websocket server                          |          |
| POST    | /sockets | socket.handshake.query.roomID | post message, broadcast to everyone in the same room |          |
