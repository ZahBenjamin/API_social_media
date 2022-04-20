const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
// edit below
router.route('/').get(getThoughts).post(createThought);


// /api/thoughts/:thoughtId
// edit below
router.route('/:userId').get(getSingleThought).put(updateThought).delete(deleteThought);


// /api/thoughts/:thoughtId/reactions
// edit below
router
  .route('/thoughts/thoughtId/reactions').post(addReaction).delete(removeReaction);

module.exports = router;
