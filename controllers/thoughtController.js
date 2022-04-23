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
  // delete thought --WORKS
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id' });
        }

        return User.findOneAndUpdate(
          { _id: req.body.userId }, 
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
  // remove reaction --WORKS
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