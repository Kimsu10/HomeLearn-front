import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentVote.css';

const StudentVote = ({ username }) => {
  const [activeVotes, setActiveVotes] = useState([]);
  const [completedVotes, setCompletedVotes] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get('/students/votes');
        const votes = response.data;
        setActiveVotes(votes.filter(vote => vote.status === 'active'));
        setCompletedVotes(votes.filter(vote => vote.status === 'completed'));
      } catch (error) {
        console.error('Failed to fetch votes', error);
      }
    };

    fetchVotes();
  }, []);

  return (
    <div className="student-vote">
      <h2>투표</h2>
      <div className="votes-section">
        <h3>진행 중인 투표</h3>
        {activeVotes.length > 0 ? (
          <ul>
            {activeVotes.map(vote => (
              <li key={vote.id}>
                <div className="vote-title">{vote.title}</div>
                <div className="vote-details">{vote.description}</div>
                <div className="vote-end-date">마감일: {vote.endDate}</div>
                <div className="vote-actions">
                  <a href={`/students/vote/${vote.id}`}>참여하기</a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>진행 중인 투표가 없습니다</p>
        )}
      </div>
      <div className="votes-section">
        <h3>마감된 투표</h3>
        <ul>
          {completedVotes.map(vote => (
            <li key={vote.id}>
              <div className="vote-title">{vote.title}</div>
              <div className="vote-details">{vote.description}</div>
              <div className="vote-end-date">마감일: {vote.endDate}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentVote;
