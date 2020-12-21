# PowerShell Rangers - Back End

## API Plan

| Method | Path             | Additional Info | Result                                         | Response                                  |
| ------ | ---------------- | --------------- | ---------------------------------------------- | ----------------------------------------- |
| GET    | /books           |                 | all books                                      | { success: Boolean, payload: Book Array } |
| GET    | /books           | ?search=potter  | all books with “potter” in the title           | { success: Boolean, payload: Book Array } |
| GET    | /books           | ?author=austen  | all books who have “austen” in the author name | { success: Boolean, payload: Book Array } |
| GET    | /books/<book_id> |                 | books with a particular id if it exists        | { success: Boolean, payload: Book }       |
| POST   | /books           | { body }        | create a new book                              | { success: Boolean, payload: Book }       |
| PUT    | /books/<book_id> | { body }        | updated book                                   | { success: Boolean, payload: Book }       |
| DELETE | /books/<book_id> |                 | book deleted                                   | { success: Boolean, payload: Book }       |
| GET    | /authors             |                 | all authors                               | { success: Boolean, payload: Author Array } |
| GET    | /authors             | ?search=austen  | all authors with “austen” in their name   | { success: Boolean, payload: Author Array } |
| GET    | /authors/<author_id> |                 | authors with a particular id if it exists | { success: Boolean, payload: Author }       |
| POST   | /authors             | { body }        | create a new author                       | { success: Boolean, payload: Author }       |
| PUT    | /authors/<author_id> | { body }        | updated author                            | { success: Boolean, payload: Author }       |
| DELETE | /authors/<author_id> |                 | author deleted                            | { success: Boolean, payload: Author }       |