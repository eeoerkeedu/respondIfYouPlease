const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Guest.js
const eventSchema = require('./Event');

const userSchema = new Schema(
  {
    guestName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    phoneNum: {
      type: String,
      required: true,
    },
    // rsvpEvents: [events]
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Guest = model('Guest', guestSchema);

module.exports = Guest;
