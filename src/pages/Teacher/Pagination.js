import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage + 1 < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination">
            <button onClick={handlePrevious} disabled={currentPage === 0}>
                Previous
            </button>
            <span>{currentPage + 1} / {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage + 1 === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;