const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mern-notes')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model('Note', noteSchema);

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/notes', async (req, res) => {
  const note = new Note({
    text: req.body.text,
    date: req.body.date,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

