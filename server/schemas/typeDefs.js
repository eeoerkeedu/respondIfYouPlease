// export {}
const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type User {
		_id: ID!
		username: String!
		email: String!
		phoneNum: Int
		createdEvents: [Event]
	}

	type Event {
		_id: ID!
		eventName: String!
		description: String!
		eventDate: Int
		location: String
		rsvps: [Guest]
	}

	type Guest {
		_id: ID!
		guestName: String!
		email: String!
		phoneNum: String
		additionalGuestCount: Int!
	}

	type Auth {
		token: ID!
		user: User
	}

	input EventInput {
		eventName: String!
		description: String!
		eventDate: Int
		location: String
	}

	input GuestInput {
		guestName: String!
		email: String!
		phoneNum: String
		additionalGuestCount: Int!
	}

	type Query {
		me: User
		guests(_id: ID!): [Guest]
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		updateUser(
			username: String!
			email: String!
			password: String!
			phoneNum: String
		): User
		createEvent(eventData: EventInput!): Event
		updateEvent(eventId: ID!, eventData: EventInput!): Event
		cancelEvent(eventId: ID!): User
		rsvp(GuestInput: GuestInput!, eventId: ID!): Event
		removeRSVP(eventId: ID!, guestId: ID!): Event
	}
`;

module.exports = typeDefs;
