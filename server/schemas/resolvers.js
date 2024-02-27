const { User, Guest, Event } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findById(context.user._id).populate(
					"createdEvents"
				);
				console.log(userData);

				return userData;
			}

			throw AuthenticationError;
		},
		guests: async (parent, { eventId }, context) => {
			if (eventId) {
				const eventData = await Event.findById({ eventId: eventId }).populate(
					"rsvps"
				);
				return eventData;
			}
		},
		// myEvents: async (parent, args, context) => {
		// 	if (context.user) {
		// 		const userData = await User.findOne({ _id: context.user._id }).populate(
		// 			"createdEvents"
		// 		);
		// 	}
		// },
	},

	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw AuthenticationError;
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw AuthenticationError;
			}

			const token = signToken(user);
			return { token, user };
		},
		createEvent: async (parent, { eventData }, context) => {
			// console.log(eventData);
			if (eventData && context.user) {
				const newEvent = await Event.create(eventData);
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { createdEvents: newEvent._id } },
					{ new: true }
				);
				// console.log(newEvent, updatedUser);
				return { newEvent, updatedUser };
			}
		},

		rsvp: async (parent, { GuestInput, eventId }, context) => {
			if (GuestInput && eventId) {
				const updateEvent = await Event.findByIdAndUpdate(
					{ eventId: eventId },
					{ $push: { rsvps: GuestInput.guestId } },
					{ new: true }
				);
				const newGuest = await Guest.create(GuestInput);

				return { updateEvent, newGuest };
			}

			throw AuthenticationError;
		},

		removeRSVP: async (parent, { guestId, eventId }, context) => {
			if (guestId && eventId) {
				const updatedEvent = await Event.findOneAndUpdate(
					{ eventId: eventId },
					{ $pull: { guest: guestId } },
					{ new: true }
				);
				const removedGuest = await Guest.findOneAndDelete({ guestId: guestId });

				return updatedEvent;
			}

			throw AuthenticationError;
		},
	},
};

module.exports = resolvers;
