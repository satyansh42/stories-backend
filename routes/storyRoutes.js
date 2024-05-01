const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, storyController.addStory);
router.put('/:id', authMiddleware, storyController.editStory);
router.put('/:storyId/like', authMiddleware, storyController.likeStory);
router.put('/:storyId/bookmark', authMiddleware, userController.bookmarkStory);
router.get('/bookmarks', authMiddleware, userController.fetchBookmarks);
router.get('/category/:category', storyController.getStoriesByCategory);
router.get('/my-stories', authMiddleware, storyController.getAllStoriesByUser);

module.exports = router;
