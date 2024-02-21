const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
    },
    guests: async (parent, {eventId}, context) => {
      if (eventId){
        const eventData = await Event.findById({eventId: eventId}).populate('rsvps');
        return eventData
      }
    },
    myEvents: async (parent, args, context) => {
      if (context.user){
        const userData = await User.findOne({ _id: context.user._id }).populate('createdEvents');
      }
    }
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
    rsvp: async (parent, { guestInput, eventInput }, context) => {
      if (guestInput && eventInput) {
        const updateEvent = await Event.findByIdAndUpdate(
          { eventId: eventInput.eventId },
          { $push: { rsvps: guestInput.guestId } },
          { new: true }
        );

        return updateEvent;
      }

      throw AuthenticationError;
    },
    createEvent: async (parent, {eventInput}, context) => {
      if (eventInput && context.user) {
        const newEvent = await Event.create(eventData)
        const updatedUser = await Event.findByIdAndUpdate(          
          { eventId: eventInput.eventId },
          { $push: { createdEvents: newEvent.eventId } },
          { new: true });
        return {newEvent, updatedUser}
      }
    },
    
    // removeBook: async (parent, { bookId }, context) => {
    //   if (context.user) {
    //     const updatedUser = await User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       { $pull: { savedBooks: { bookId } } },
    //       { new: true }
    //     );

    //     return updatedUser;
    //   }

    //   throw AuthenticationError;
    // },
  },
};

module.exports = resolvers;
