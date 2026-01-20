const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    passwordHash: bcrypt.hashSync('Admin@123', 10)
  },
  {
    id: 2,
    email: 'user@example.com',
    name: 'Demo User',
    role: 'user',
    passwordHash: bcrypt.hashSync('User@123', 10)
  }
];

function findUserByEmail(email) {
  return users.find((user) => user.email === email.toLowerCase());
}

module.exports = {
  users,
  findUserByEmail
};
