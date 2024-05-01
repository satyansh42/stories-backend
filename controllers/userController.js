const Story = require('../models/Story');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

exports.bookmarkStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.user;

    const story = await Story.findById(storyId);
    const user = await User.findById(userId);
    let message = '';

    if (!user || !story) {
      return res.status(404).json({ message: `User or story not found ${req.params}` });
    }

    // Check if story is already bookmarked
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove story from bookmarks
      user.bookmarks.pull(storyId);
    } else {
      // Add story to bookmarks
      user.bookmarks.push(storyId);
    }

    // Save the updated user
    await user.save();

    // Toggle bookmark status
    if (story.bookmarkedBy.includes(req.user.userId)) {
      const indexToRemove = story.bookmarkedBy.indexOf(req.user.userId);
      story.bookmarkedBy.splice(indexToRemove, 1);
      message = "Bookmark removed successfully";
    } else {
      story.bookmarkedBy.push(req.user.userId);
      message = "Bookmark added successfully"
    }

    // Save the updated story
    await story.save();

    res.json({ message, story });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.fetchBookmarks = async (req, res) => {
  try {
    const bookmarkedStories = await Story.find({ bookmarkedBy: req.user.userId });
    res.json(bookmarkedStories);
  } catch (error) {
    errorHandler(res, error);
  }
};
