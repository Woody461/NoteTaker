const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/notes', (req, res) => {
  res.render('notes');
});

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

app.get('*', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
