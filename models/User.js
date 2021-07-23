const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');

// Schema 
const UserSchema = new Schema(
    {
      username: {
        type: String,
        required: 'You need to provide a pizza name!',
        unique: true,
        trim: true
      },
      email: {
        type: String,
        required: 'You need to provide a username!',
        unique: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address']
      },
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought'
        }
      ],
      friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
      ]
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false
    }
);


// create the User model using the UserSchema
const User = model('User', UserSchema);

// virtual gets total count of friends on retrieval
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length 
});

// export the User model
module.exports = User;