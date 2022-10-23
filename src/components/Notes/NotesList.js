import React from 'react';


const NotesList = (props) => (
    <div className='notes-list'>
        {props.children}
    </div>
);


export default NotesList;