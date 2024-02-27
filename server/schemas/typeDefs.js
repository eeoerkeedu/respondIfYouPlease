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
		guestId: ID!
		guestName: String!
		email: String!
		phoneNum: Int
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
		guestId: ID!
		guestName: String!
		email: String!
		phoneNum: Int
		additionalGuestCount: Int!
	}

	type Query {
		me: User
		guests(eventId: ID!): [Guest]
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		createEvent(eventData: EventInput!): Event
		rsvp(GuestInput: GuestInput!, eventId: ID!): Event
		removeRSVP(guestId: ID!, eventId: ID!): Event
	}
`;

module.exports = typeDefs;
