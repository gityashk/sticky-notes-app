import { useContext } from "react";
import NoteCard from "../components/NoteCard.jsx";
import { NoteContext } from "../context/NoteContext.jsx";
import Controls from "../components/Controls.jsx";

function NotesPage() {

    const { notes } = useContext(NoteContext);

    return (
        <div>
            {notes.map((note) => (
                <NoteCard key={note.$id} note={note} />
            ))}
            <Controls />
        </div>
    )
}

export default NotesPage;