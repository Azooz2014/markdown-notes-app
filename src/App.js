import "./styles/App.css";
import React from "react";
import { nanoid } from "nanoid";
import Split from "react-split";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

export default function App() {
  const [notes, setNotes] = React.useState(() => retriveNotes() || []);
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  //Saves notes into localstorage when ever notes state is changed.
  React.useEffect(
    () => localStorage.setItem("notes", JSON.stringify(notes)),
    [notes]
  );

  //Parse and retrive notes from localstorage.
  function retriveNotes() {
    return JSON.parse(localStorage.getItem("notes"));
  }

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  // figure out a way to move the updated notes further to be first in the notes array.
  function updateNote(text) {
    /* setNotes((oldNotes) =>
      oldNotes.map((oldNote) => {
        return oldNote.id === currentNoteId
          ? { ...oldNote, body: text }
          : oldNote;
      })
    ); */

    const selectedNote = notes
      .splice(
        notes.findIndex((element) => element.id === currentNoteId),
        1
      )
      .pop();

    const updatedNote = { ...selectedNote, body: text };

    setNotes((prevNotes) => [updatedNote, ...prevNotes]);
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
