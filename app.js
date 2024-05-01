const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/story_platform';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
