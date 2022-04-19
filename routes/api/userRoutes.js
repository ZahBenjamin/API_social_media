const router = require('express').Router();
const {
  
} = require('../../controllers/userController');

// /api/users
// edit below
router.route('/').get(getUsers).post(createStudent);

// /api/users/:userId
// edit below
router.route('/:studentId').get(getSingleStudent).delete(deleteStudent);

// /api/users/:userId/friends/:friendId
// edit below
router.route('/:studentId/assignments').post(addAssignment);

module.exports = router;
