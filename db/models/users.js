const Sequelize = require('sequelize');
const db = require('../connect.js');
const bcrypt = require('bcryptjs');

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Username already exists!',
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  facebookId: Sequelize.STRING,
  facebookToken: Sequelize.STRING,
  facebookEmail: Sequelize.STRING,
  facebookName: Sequelize.STRING
}, {
  classMethods: {
    validPassword: function (user, password) {
      bcrypt.compareSync(password, user.password);
    },
  },
// }, {
//   hooks: {
//     afterValidate: function (user) {
//       user.password = bcrypt.hashSync(user.password, 8);
//     },
//   },
// });
});

module.exports = User;