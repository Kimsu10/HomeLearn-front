import React, { useState, useEffect } from 'react';
import axios from "../../utils/axios";
import './TeacherVote.css';

const TeacherVote = () => {
  const [newVote, setNewVote] = useState({ title: '', description: '', deadline: '' });
  const [ongoingVotes, setOngoingVotes] = useState([]);
  const [finishedVotes, setFinishedVotes] = useState([]);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const ongoingResponse = await axios.get('/teachers/votes/ongoing');
      const finishedResponse = await axios.get('/teachers/votes/finished');
      setOngoingVotes(ongoingResponse.data);
      setFinishedVotes(finishedResponse.data);
    } catch (error) {
      console.error('투표 데이터를 불러오는데 실패했습니다.', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVote({ ...newVote, [name]: value });
  };

  const handleCreateVote = async () => {
    try {
      await axios.post('/teachers/votes', newVote);
      setNewVote({ title: '', description: '', deadline: '' });
      fetchVotes();
    } catch (error) {
      console.error('투표를 생성하는데 실패했습니다.', error);
    }
  };

  const handleFinishVote = async (voteId) => {
    try {
      await axios.post(`/teachers/votes/${voteId}`);
      fetchVotes();
    } catch (error) {
      console.error('투표를 마감하는데 실패했습니다.', error);
    }
  };

  const handleDeleteVote = async (voteId) => {
    try {
      await axios.delete(`/teachers/votes/${voteId}`);
      fetchVotes();
    } catch (error) {
      console.error('투표를 삭제하는데 실패했습니다.', error);
    }
  };

  return (
    <div className="teacher-vote-container">
      <h2>투표 관리</h2>

      <div className="new-vote-section">
        <h3>새로운 투표 생성</h3>
        <input
          type="text"
          name="title"
          placeholder="투표 제목"
          value={newVote.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="투표 설명"
          value={newVote.description}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="datetime-local"
          name="deadline"
          value={newVote.deadline}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateVote}>투표 생성</button>
      </div>

      <div className="ongoing-votes-section">
        <h3>진행 중인 투표</h3>
        {ongoingVotes.length > 0 ? (
          ongoingVotes.map(vote => (
            <div key={vote.id} className="vote-item">
              <h4>{vote.title}</h4>
              <p>{vote.description}</p>
              <p>마감일: {new Date(vote.deadline).toLocaleString()}</p>
              <button onClick={() => handleFinishVote(vote.id)}>마감</button>
              <button onClick={() => handleDeleteVote(vote.id)}>삭제</button>
            </div>
          ))
        ) : (
          <p>진행 중인 투표가 없습니다.</p>
        )}
      </div>

      <div className="finished-votes-section">
        <h3>종료된 투표</h3>
        {finishedVotes.length > 0 ? (
          finishedVotes.map(vote => (
            <div key={vote.id} className="vote-item">
              <h4>{vote.title}</h4>
              <p>{vote.description}</p>
              <p>마감일: {new Date(vote.deadline).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>종료된 투표가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherVote;
