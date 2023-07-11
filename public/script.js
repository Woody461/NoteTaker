document.addEventListener('DOMContentLoaded', () => {
    const existingNotesContainer = document.getElementById('existing-notes');
    const noteTitleInput = document.getElementById('note-title');
    const noteTextInput = document.getElementById('note-text');
    const saveNoteButton = document.getElementById('save-note');
  
    // Function to fetch and display existing notes
    const getExistingNotes = () => {
      fetch('/api/notes')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch notes');
          }
          return response.json();
        })
        .then(notes => {
          existingNotesContainer.innerHTML = '';
  
          notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note');
            noteItem.innerHTML = `
              <h3>${note.title}</h3>
              <p>${note.text}</p>
            `;
  
            existingNotesContainer.appendChild(noteItem);
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
  
    // Event listener for save note button
    saveNoteButton.addEventListener('click', () => {
      const newNote = {
        title: noteTitleInput.value,
        text: noteTextInput.value,
      };
  
      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to save note');
          }
          return response.json();
        })
        .then(savedNote => {
          noteTitleInput.value = '';
          noteTextInput.value = '';
          getExistingNotes(); // Refresh the existing notes list
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  
    // Initial loading of existing notes
    getExistingNotes();
  });
  