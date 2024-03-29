const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schema from Event.js
const eventSchema = require("./Event");

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
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
		password: {
			type: String,
			required: true,
		},
		// set savedBooks to be an array of data that adheres to the bookSchema
		createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
	},
	// set this to use virtual below
	{
		toJSON: {
			virtuals: true,
		},
	}
);

// when we query user, we'll also get another field called `createdEventsCount` with the number of events that user has created
userSchema.virtual("createdEventsCount").get(function () {
	return this.createdEvents.length;
});

// hash user password
userSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}

	next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
// userSchema.virtual('bookCount').get(function () {
//   return this.savedBooks.length;
// });

const User = model("User", userSchema);

module.exports = User;
