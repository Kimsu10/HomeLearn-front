// src/ViewBoardImage.js
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewBoardImage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/test/view')
            .then(response => {
                setTitle(response.data.title);
                setContent(response.data.content);
            })
            .catch(error => {
                console.error('There was an error fetching the board data!', error);
            });
    }, []);

    return (
        <div>
            <h1>{title}</h1>
            <div className="fr-view" dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
    );
};

export default ViewBoardImage;