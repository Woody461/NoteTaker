const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }

    const notes = JSON.parse(data);

    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };

    notes.push(newNote);

    fs.writeFile(
      path.join(__dirname, 'db.json'),
      JSON.stringify(notes, null, 2),
      'utf8',
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error writing notes data' });
        }

        res.json(newNote);
      }
    );
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes data' });
      }
  
      const notes = JSON.parse(data);
  
      // Find the index of the note with the matching id
      const noteIndex = notes.findIndex((note) => note.id === noteId);
  
      // If the note is found, remove it from the notes array
      if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
  
        fs.writeFile(
          path.join(__dirname, 'db.json'),
          JSON.stringify(notes, null, 2),
          'utf8',
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error writing notes data' });
            }
  
            res.sendStatus(204); // Send a success status with no content
          }
        );
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    });
  });

// HTML routes
app.get('/notes', (req, res) => {
  res.render('notes');
});

app.get('*', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
