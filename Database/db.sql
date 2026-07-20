CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT  NOT NULL UNIQUE,
   passHash TEXT NOT NULL
)

CREATE TABLE profile(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE ON DELETE CASCADE
    gender varchar(10) NOT NULL,
    profession TEXT NOT NULL
)