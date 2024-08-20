import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [pageNumbers, setPageNumbers] = useState([]);

    useEffect(() => {
        const pageSize = 10;
        const currentBlock = Math.floor((currentPage - 1) / pageSize);
        const startPage = currentBlock * pageSize + 1;
        const endPage = Math.min(startPage + pageSize - 1, totalPages);

        const newPageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            newPageNumbers.push(i);
        }
        setPageNumbers(newPageNumbers);
    }, [currentPage, totalPages]);

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                처음
            </button>

            <button onClick={() => onPageChange(Math.max(pageNumbers[0] - 1, 1))} disabled={currentPage === 1}>
                이전
            </button>

            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={number === currentPage ? 'active' : ''}>
                    {number}
                </button>
            ))}
            <button onClick={() => onPageChange(Math.min(pageNumbers[pageNumbers.length - 1] + 1, totalPages))}
                    disabled={currentPage === totalPages}>
                다음
            </button>
            <button onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}>
                마지막
            </button>
        </div>
    );
};

export default Pagination;