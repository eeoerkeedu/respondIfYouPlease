const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schema from Guest.js
const eventSchema = require("./Event");

const guestSchema = new Schema(
	{
		guestName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [/.+@.+\..+/, "Must use a valid email address"],
		},
		phoneNum: {
			type: String,
			match: [
				/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
				"Must Enter a Vaild Phone Number",
			],
		},
		additionalGuestCount: {
			type: Number,
			required: true,
			min: 0,
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

const Guest = model("Guest", guestSchema);

module.exports = Guest;
