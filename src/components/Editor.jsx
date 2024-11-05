import React, { useContext, useState, useEffect } from 'react';
import { NotesContext } from './NotesContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/editor.css';

export default function Editor() {
    const [note, setNote] = useState('');
    const { notes, addNote, editNote } = useContext(NotesContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const editIndex = query.get('edit');
        if (editIndex !== null) {
            setNote(notes[parseInt(editIndex)]);
        }
    }, [location.search, notes]);

    const handleSave = () => {
        const query = new URLSearchParams(location.search);
        const editIndex = query.get('edit');
        if (editIndex !== null) {
            editNote(parseInt(editIndex), note);
        } else {
            if (note.trim()) {
                addNote(note);
            }
        }
        setNote('');
        navigate('/');
    };

    return (
        <div className="page-container">
            <div className='editor' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <textarea
                    className='note-editor'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='Digite sua nota aqui...'
                    style={{ width: '300px', height: '300px', resize: 'both' }}
                />
                <button
                    className='save-btn'
                    onClick={handleSave}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#000000',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        alignSelf: 'center'  // Centraliza o botão dentro do editor
                    }}
                >
                    Salvar
                </button>
            </div>
        </div>
    );
}
