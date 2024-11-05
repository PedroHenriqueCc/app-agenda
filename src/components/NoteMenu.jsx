// NoteMenu.jsx
import React, { useContext } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { NotesContext } from './NotesContext';
import { useNavigate } from 'react-router-dom';

export default function NoteMenu({ anchorEl, open, onClose, index }) {
    const { deleteNote } = useContext(NotesContext);
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/view/${index}`); // Garante que o index seja enviado corretamente
        onClose();
    };

    const handleEdit = () => {
        navigate(`/editor?edit=${index}`);
        onClose();
    };

    const handleDelete = () => {
        deleteNote(index);
        onClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
        >
            <MenuItem onClick={handleView}>Ver Nota Completa</MenuItem>
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleDelete}>Deletar</MenuItem>
        </Menu>
    );
}
