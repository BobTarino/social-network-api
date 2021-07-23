const { Thought, User } = require('../models');

const ThoughtController = {

  // get all thoughts (GET /api/thoughts)
  getAllThoughts(req, res) {
    Thought.find({})
    .populate({ path: 'reactions', select: '-__v' })
    .select('-__v')
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
  },
  //  get thoughts by id (GET /api/thoughts/:id)
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({ path: 'reactions', select: '-__v' })
    .select('-__v')
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({message: 'No thought found with this id'});
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
  },
  // add thought to User
  createThought({ params, body }, res) {
    console.log(body);
    thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.UserId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  // add nested reaction to thought (POST /api/thoughts/:thoughtId/reactions)
  addReaction({ params, body }, res) {
        thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
  },
  // update Thought by id (PUT /api/Thoughts/:id)
  updateThought({ params, body }, res) {
        // {new: true} instructs mongoose to return new version of document with Validators 
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
  },
  // remove thought
  removeThought({ params }, res) {
        thought.findOneAndDelete({ _id: params.thoughtId })
          .then(deletedthought => {
            if (!deletedthought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
              { _id: params.UserId },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
  },

  // remove Reaction (DELETE /api/thoughts/:thoughtId/reactions)
  deleteReaction({ params }, res) {
    thought.findOneAndUpdate(
      { _id: params.thoughtId },
      // $pull operator to remove the specific Reaction from the reactions array where the ReactionId matches the value of params.ReactionId passed in from the route.
      { $pull: { reactions: { ReactionId: params.ReactionId } } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = ThoughtController;