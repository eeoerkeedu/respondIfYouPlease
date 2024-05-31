// export {}
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
		
		updateUser: async (
			parent,
			{ username, email, password, phoneNum },
			context
		) => {
			const userData = await User.findById(context.user._id);

			if (!userData) {
				throw AuthenticationError;
			}
			const updatedUser = await User.findOneAndUpdate(
				{ _id: context.user._id },
				{
					username: username,
					email: email,
					password: password,
					phoneNum: phoneNum,
				},
				{ new: true }
			);
			return updatedUser;
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
				return newEvent;
			}
		},

		updateEvent: async (parent, { eventId, eventData }, context) => {
			// console.log(eventId, eventData);
			if (eventId && eventData && context.user) {
				const modifiedEvent = await Event.findOneAndUpdate(
					{ _id: eventId },
					{
						description: eventData.description,
						eventDate: eventData.eventDate,
						eventName: eventData.eventName,
						location: eventData.location,
					},
					{ new: true }
				);
				// 	{ new: true }
				// );
				// console.log(updatedUser, modifiedEvent);
				return modifiedEvent;
			}

			throw AuthenticationError;
		},

		cancelEvent: async (parent, { eventId }, context) => {
			if (eventId && context.user) {
				const cancelledEvent = await Event.findOneAndDelete({ _id: eventId });
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { createdEvents: eventId } },
					{ new: true }
				);
				console.log(updatedUser, cancelledEvent);
				return updatedUser;
			}

			throw AuthenticationError;
		},

		rsvp: async (parent, { GuestInput, eventId }, context) => {
			// console.log(GuestInput, eventId);
			if (GuestInput && eventId) {
				const newGuest = await Guest.create(GuestInput);
				const updatedEvent = await Event.findByIdAndUpdate(
					{ _id: eventId },
					{ $push: { rsvps: newGuest._id } },
					{ new: true }
				);
				// console.log(updatedEvent, newGuest);

				return updatedEvent;
			}

			throw AuthenticationError;
		},

		removeRSVP: async (parent, { eventId, guestId }, context) => {
			// console.log(args);
			if (eventId && guestId) {
				const updatedEvent = await Event.findOneAndUpdate(
					{ _id: eventId },
					{ $pull: { rsvps: guestId } },
					{ new: true }
				);
				const removedGuest = await Guest.findOneAndDelete({ _id: guestId });
				// console.log(updatedEvent, removedGuest);
				return updatedEvent;
			}

			throw AuthenticationError;
		},
	},
};

module.exports = resolvers;
