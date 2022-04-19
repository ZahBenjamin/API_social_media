const router = require('express').Router();
const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../../controllers/thoughtController');

// /api/thoughts
// edit below
router.route('/').get(getCourses).post(createCourse);

// /api/thoughts/:thoughtId/reactions
// edit below
router
  .route('/:courseId')
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
