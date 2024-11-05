import React, { useContext } from 'react';
import { NotesContext } from './NotesContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/view.css';

export default function ViewNote() {
    const { id } = useParams(); // Captura o ID da URL
    const { notes } = useContext(NotesContext); // Pega as notas do contexto
    const navigate = useNavigate();

    const note = notes[id]; // Tenta acessar a nota pelo índice fornecido na URL

    return (
        <div className='view-note'>
            <button onClick={() => navigate('/')}>Voltar</button>
            <div className='note-content'>
                {note ? (
                    <p>{note.text || note}</p> // Verifica se note.text existe, caso contrário exibe note diretamente
                ) : (
                    <p>Nota não encontrada</p> // Mensagem de erro se note não existir
                )}
            </div>
        </div>
    );
}