const { Thought, User } = require('../models');

module.exports = {
  // get thought --WORKS
  getThoughts(req, res) {
    Thought.find()
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));
},
  // get single thought --WORKS
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thought --WORKS
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          {new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created but no user with this id!' });
        }
        res.json({ message: 'Successful thinking! '});
      })
      .catch((err) => res.status(500).json(err));
  },
  // update thought --WORKS
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {  $set: req.body },
      { new: true }
      )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  // delete thought --WORKS(DOESN'T DELETE IN USERDB)
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id' });
        }

        return User.findOneAndUpdate(
          { _id: req.body.userId }, // should be the user id
          { $pull: { thoughts: req.params.thoughtId } },
          {new: true }
        );
      }) 
      .then((thought) => {
        if (!thought) {
          return res.json(({ message: 'Thought successfully deleted!' }));
        }
      })
      .catch((err) => res.status(500).json(err));
  },
  // add reaction --WORKS
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
    )
        .then(thoughts => {
            if (!thoughts) {
                res.status(404).json({ message: 'No Thoughts Using This ID Found!' });
                return;
            }
            res.json(thoughts);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
},
  // remove reaction --TESTING
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Bad reaction!' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
};

// /api/thoughts

// GET to get all thoughts

// GET to get a single thought by its _id

// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

// PUT to update a thought by its _id

// DELETE to remove a thought by its _id

// /api/thoughts/:thoughtId/reactions

// POST to create a reaction stored in a single thought's reactions array field

// DELETE to pull and remove a reaction by the reaction's reactionId value
