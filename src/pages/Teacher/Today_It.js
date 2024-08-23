import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Today_It.css';

const Today_It = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('/teachers/dash-boards/news');
                setNews(response.data);
            } catch (error) {
                console.error('뉴스를 불러오는 데 실패했습니다:', error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="teacher-today-container">
            <div className="teacher-today-header">
                <div className="teacher-today-title">오늘의 IT</div>
            </div>
            <ul className="teacher-today-list">
                {news.map((item, index) => (
                    <li key={index} className="teacher-today-list-content">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <div className="teacher-today-news-title">{item.title}</div>
                            <div className="teacher-today-news-content-container">
                                <p className="teacher-today-news-content">{item.content}</p>
                                <img src={item.imageUrl} alt={item.title} className="teacher-today-news-image" />
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Today_It;