
const { Schema, model } = require("mongoose");

// import schema from Guest.js
const guestSchema = require("./Guest");

const eventSchema = new Schema(
	{
		eventName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		eventDate: {
			type: Number,
		},
		location: {
			type: String,
		},
		rsvps: [
			{
				type: Schema.Types.ObjectId,
				ref: "Guest",
			},
		],
	},
	// set this to use virtual below
	{
		toJSON: {
			virtuals: true,
		},
	}
);

// when we query an event, we'll also get another field called `guestCount` with the number of rsvp's
eventSchema.virtual("guestCount").get(function () {
	return this.rsvps.length;
});
const Event = model("Event", eventSchema);

module.exports = Event;
