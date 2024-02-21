import { gql } from "@apollo/client";

const typeDefs = gql`
	type User {
		_id: ID!
		username: String!
		email: String!
		phoneNum: Int
		createdEvents: [Event]
	}

	type Event {
		eventId: ID!
		eventName: String
		description: String
		eventDate: Date
		Location: String
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
		eventId: ID!
		eventName: String
		description: String
		eventDate: Date
		Location: String
		rsvps: [Guest]
	}

	type GuestInput {
		guestId: ID!
		guestName: String!
		email: String!
		phoneNum: Int
		additionalGuestCount: Int!
	}

	type Query {
		me: User
		guests(eventId: ID!): Event
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		createdEvent(EventInput: EventInput!): Event
		rsvp(GuestInput: GuestInput!, EventInput: EventInput!): Event
		removeRSVP(guestId: ID!, guestId: ID!): Event
	}
`;

module.exports = typeDefs;
