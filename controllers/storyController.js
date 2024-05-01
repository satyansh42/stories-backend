const Story = require('../models/Story');
const errorHandler = require('../utils/errorHandler');

exports.addStory = async (req, res) => {
  try {
    const { slides, category } = req.body;
    const userId = req.user.userId;
    const newStory = new Story({ slides, category, author: userId });
    await newStory.save();
    res.status(201).json({ message: 'Story added successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.editStory = async (req, res) => {
  try {
    const { slides, category } = req.body;
    const userId = req.user.userId;
    const storyId = req.params.id;
    const updatedStory = await Story.findOneAndUpdate(
      { _id: storyId, author: userId },
      { slides, category },
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story updated successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.likeStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    let message = '';

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.likes.includes(req.user.userId)) {
      const indexToRemove = story.likes.indexOf(req.user.userId);
      story.likes.splice(indexToRemove, 1);
      message = "Like deleted successfully"
    } else {
      story.likes.push(req.user.userId);
      message = "Like added successfully"
    }

    await story.save();

    res.json({ message, story });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getStoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const stories = await Story.find({ category });
    res.json(stories);
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllStoriesByUser = async (req, res) => {
  const userId = req.user.userId; // Assuming user ID is available in req.user

  try {
    const stories = await Story.find({ author: userId });
    res.json(stories);
  } catch (error) {
    errorHandler(res, error);
  }
};
