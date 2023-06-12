CREATE TABLE userslabook (
    user_id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime())
);

CREATE TABLE posts (
  post_id TEXT PRIMARY KEY NOT NULL UNIQUE,
  creator_id TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT(0) NOT NULL,
  deslikes INTEGER DEFAULT(0) NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime()),
  updated_at TEXT NOT NULL DEFAULT (datetime()),
  FOREIGN KEY (creator_id) REFERENCES users_id (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE likes_deslikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);


-- Inserção de dados na tabela "users"
INSERT INTO users (id, name, email, password, role, created_at)
VALUES ('1', 'Jimi', 'jimi@email.com', 'jimizinho', 'admin', '2023-06-11 10:23:45'),
       ('2', 'Fred', 'frederico@email.com', 'fredinho', 'user', '2023-06-11 11:15:22'),
       ('3', 'Pudim', 'pudim@email.com', 'miau', 'user', '2023-06-11 12:45:18');

-- Inserção de dados na tabela "posts"
INSERT INTO posts (id, creator_id, content, likes, dislikes, created_at, updated_at)
VALUES ('1', '1', 'Hello, world!', 10, 2, '2023-06-11 09:30:12', '2023-06-11 09:30:12'),
       ('2', '1', 'Check out this amazing photo!', 25, 1, '2023-06-11 11:45:36', '2023-06-11 11:45:36'),
       ('3', '2', 'my new blog post!', 5, 0, '2023-06-11 14:20:59', '2023-06-11 14:20:59');

-- Inserção de dados na tabela "likes_deslikes"
INSERT INTO likes_deslikes (user_id, post_id, like)
VALUES ('1', '1', 1),
       ('1', '2', 1),
       ('2', '1', 1),
       ('3', '2', 0);




