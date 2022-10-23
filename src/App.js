import React, { useState, useEffect } from "react";
import "./App.css";
import Preview from "./components/Preview";
import Message from "./components/Message";
import NotesContainer from "./components/Notes/NotesContainer";
import NotesList from "./components/Notes/NotesList";
import Note from "./components/Notes/Note";
import NoteForm from "./components/Notes/NoteForm";
import Alert from "./components/Alert";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
 


  useEffect(() => {
    if (localStorage.getItem("notes")) {
      setNotes(JSON.parse(localStorage.getItem("notes")));
    } else {
      localStorage.setItem("notes", JSON.stringify([]));
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([]);
      }, 3000);
    }
  }, [validationErrors]);

  const saveToLocalStorage = (name, item) => {
    localStorage.setItem(name, JSON.stringify(item));
  };

  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if (!title) {
      validationErrors.push('Please enter note title');
      passed = false;
    }
    if (!content) {
      validationErrors.push('Please enter note content');
      passed = false;
    }
    setValidationErrors(validationErrors);
    return passed;
  };

  //Change Title
  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  //Change Content
  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  // Save Note
  const saveNoteHandler = () => {

    if (!validate()) return;
    const note = {
      id: new Date(),
      title: title,
      content: content,
    };

    const updatedNotes = [...notes, note];

    saveToLocalStorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle("");
    setContent("");
  };

  // Select Note
  const selectNotHandler = (noteId) => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  };

  // switch to note edit mode
  const editNoteHandler = () => {
    const note = notes.find((note) => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  // Delete note
  const deleteNoteHandler = () => {
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex(
      (note) => note.id === selectedNote
    );
    notes.splice(noteIndex, 1);
    saveToLocalStorage("notes", notes);
    setNotes(notes);
    setSelectedNote(null);
  };

  // update Note
  const updateNoteHandler = () => {
    if (!validate()) return;
    const updatedNotes = [...notes];
    const noteIndex = notes.findIndex((note) => note.id === selectedNote);
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content,
    };

    saveToLocalStorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle("");
    setContent("");
  };
  // switch to add note mode
  const addNoteHandler = () => {
    setCreating(true);
    setTitle("");
    setContent("");
    setEditing(false);
  };

  const getAddNote = () => {
    return (
      <NoteForm
        formTitle=" Add New Note"
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText="Save"
        submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title="There are no notes" />;
    }

    if (!selectedNote) {
      return <Message title="Please select notes" />;
    }

    const note = notes.find((note) => {
      return note.id === selectedNote;
    });

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle="Edit Note"
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText="Edit"
          submitClicked={updateNoteHandler}
        />
      );
    }

    return (
      <div>
        {!editing && (
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map((note) => (
            <Note
              key={note.id}
              title={note.title}
              noteClicked={() => selectNotHandler(note.id)}
              active={selectedNote === note.id}
            />
          ))}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>
          +
        </button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
      {validationErrors.length !== 0 && (
        <Alert validationMessages={validationErrors} />
      )}
    </div>
  );
}

export default App;
