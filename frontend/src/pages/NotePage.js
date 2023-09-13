import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';

function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

const NotePage = ({ match, history }) => {
  const params = useParams();
  const noteId = params.id;
  const navigate = useNavigate();
  const csrfToken = getCookie('csrftoken');
  const [note, setNotes] = useState(null);

  useEffect(() => {
    getNotes();
  }, [noteId]);

  const getNotes = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const updateNote = async () => {
    try {
      await fetch(`/api/notes/${noteId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(note),
      });
      // Navigate back to the home page after updating the note
      navigate('/');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const createNote = async () => {
    try {
      await fetch(`/api/notes/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(note),
      });
      // Navigate back to the home page after creating the note
      navigate('/');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const deleteNote = async () => {
    try {
      await fetch(`/api/notes/${noteId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(note),
      });
      // Navigate back to the home page after deleting the note
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSubmit = () => {
    console.log('NOTE:', note);
    if (noteId !== 'new' && note.body === '') {
      deleteNote();
    } else if (noteId !== 'new') {
      updateNote();
    } else if (noteId === 'new' && note.body !== null) {
      createNote();
    }

    navigate('/');
  };

  const handleChange = (value) => {
    setNotes((prevNote) => ({ ...prevNote, 'body': value }));
    console.log('Handle Change:', note);
  };

  return (
    <div className='note'>
      <div className='note-header'>
        <h3><ArrowLeft onClick={handleSubmit}></ArrowLeft></h3>
        {noteId !== 'new' ? (
          <button onClick={deleteNote}>Delete</button>
        ) : (
          <button onClick={handleSubmit}>Done</button>
        )}
      </div>
      <textarea onChange={(e) => { handleChange(e.target.value) }} value={note?.body}></textarea>
    </div>
  );
};

export default NotePage;