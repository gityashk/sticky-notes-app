import { useRef, useEffect, useState, useContext } from "react"
import Spinner from "../icons/Spinner"
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils"
import { db } from "../appwrite/databases"
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";

function NoteCard({ note }) {
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);
    const { setSelectedNote } = useContext(NoteContext)

    const body = bodyParser(note.body)
    const [position, setPosition] = useState(JSON.parse(note.position))
    const colors = JSON.parse(note.colors)

    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    const textAreaRef = useRef(null)

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);

    function mouseDown(e) {
        if (e.target.className === "card-header") {
            setZIndex(cardRef.current);
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            setSelectedNote(note)
        }
    }

    function mouseMove(e) {
        const mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY
        }

        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPosition(newPosition);
    }

    function mouseUp() {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("position", newPosition);
    }

    async function saveData(key, value) {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    async function handleKeyUp() {
        setSaving(true);
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    return (
        <div ref={cardRef} className="card" style={{ background: colors.colorBody, left: `${position.x}px`, top: `${position.y}px` }}>
            <div onMouseDown={mouseDown} className="card-header" style={{ backgroundColor: colors.colorHeader }}>
                <DeleteButton noteId={note.$id} />
                {
                    saving && (
                        <div className="card-saving">
                            <Spinner color={colors.colorText} />
                            <span style={{ color: colors.colorText }}>Saving...</span>
                        </div>
                    )
                }
            </div>
            <div className="card-body">
                <textarea onKeyUp={handleKeyUp} ref={textAreaRef} onFocus={() => { setZIndex(cardRef.current); setSelectedNote(note) }} onInput={() => autoGrow(textAreaRef)} style={{ color: colors.colorText }} defaultValue={body}></textarea>
            </div>
        </div>
    )
}

export default NoteCard;