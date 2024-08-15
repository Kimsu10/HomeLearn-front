import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Lecture_State.css';

// Chart.js 초기화
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const Lecture_State = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [homeworkData, setHomeworkData] = useState(null);

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`;
        setCurrentDate(formattedDate);

        // 실제 API 통신 부분 (나중에 주석 해제하세요)
        // fetch('/teachers/dash-boards/attendance-state')
        //     .then(response => response.json())
        //     .then(data => setAttendanceData(data))
        //     .catch(error => console.error('Error fetching attendance data:', error));

        // fetch('/teachers/dash-boards/homework-state')
        //     .then(response => response.json())
        //     .then(data => setHomeworkData(data))
        //     .catch(error => console.error('Error fetching homework data:', error));

        // 목데이터 사용 (실제 데이터를 사용할 때 이 부분을 주석 처리하세요)
        import('../../data/Teacher/mockData.json').then((data) => {
            setAttendanceData(data.attendanceData);
            setHomeworkData(data.homeworkData);
        });
    }, []);

    // 출석 현황 차트 데이터
    const attendanceChartData = attendanceData ? {
        labels: Object.keys(attendanceData.weekAttendance),
        datasets: [
            {
                label: '출석 인원',
                data: Object.values(attendanceData.weekAttendance),
                backgroundColor: '#AAC4FF',
                borderColor: '#B1B2FF',
                borderWidth: 1,
                borderRadius: 5,
                barPercentage: 0.7,
                categoryPercentage: 0.7,
            }
        ],
    } : {};

    // 출석 현황 차트의 옵션 (디자인 조정)
    const attendanceChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                labels: {
                    font: {
                        size: 10,
                        family: 'NanumSquare, sans-serif',
                    },
                    color: '#AAC4FF',
                },
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                offset: 2,
                color: '#AAC4FF',
                font: {
                    size: 12,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#AAC4FF',
                    font: {
                        size: 10,
                        family: 'NanumSquare, sans-serif',
                    },
                    padding: 1,
                },
                border: {
                    color: '#B1B2FF',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
                border: {
                    display: false,
                },
            },
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        barThickness: 18,
    };

    // 과제 제출 차트 데이터
    const homeworkChartData = homeworkData ? {
        labels: ['제출', '미제출'],
        datasets: [
            {
                label: ['제출', '미제출'],
                data: [homeworkData.submitRate, 100 - homeworkData.submitRate],
                backgroundColor: ['#AAC4FF', '#DF7D71'],
                borderColor: ['#B1B2FF', '#F13429'],
                borderWidth: 1,
                borderRadius: 5,
                barPercentage: 0.7,
                categoryPercentage: 0.7,
            },
        ],
    } : {};

    // 과제 제출 차트의 옵션
    const homeworkChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                labels: {
                    font: {
                        size: 10,
                        family: 'NanumSquare, sans-serif',
                    },
                    color: '#AAC4FF',
                },
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                offset: 2,
                color: (context) => {
                    const label = context.dataset.label[context.dataIndex];
                    return label === '제출' ? '#AAC4FF' : '#DF7D71';
                },
                font: {
                    size: 12,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: (context) => {
                        const label = context.tick.label;
                        return label === '제출' ? '#AAC4FF' : '#DF7D71';
                    },
                    font: {
                        size: 10,
                        family: 'NanumSquare, sans-serif',
                    },
                    padding: 1,
                },
                border: {
                    color: '#B1B2FF',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
                border: {
                    display: false,
                },
            },
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        },
        barThickness: 18
    };

    return (
        <div className="Lecture_state_container">
            <div className="Lecture_state_title">
                <h2 className="h2">수강 현황</h2>
                <div className="Lecture_state_date">{currentDate}</div>
            </div>
            <div className="Lecture_state_chart_container">
                <div className="Lecture_state_content">
                    <div className="attendance_state">
                        <h2 className="h2">출석 현황</h2>
                        <span>{attendanceData ? `${attendanceData.attendance} / ${attendanceData.total} 명` : '로딩 중...'}</span>
                        <div className="attendance_chart">
                            {attendanceData &&
                                <Bar
                                    data={attendanceChartData}
                                    options={attendanceChartOptions} // 수정된 옵션 적용
                                />
                            }
                        </div>
                    </div>

                    <div className="homework_state">
                        <h2 className="h2">과제 제출</h2>
                        <span>{homeworkData ? homeworkData.title : '로딩 중...'}</span>
                        <div className="homework_chart">
                            {homeworkData &&
                                <Bar
                                    data={homeworkChartData}
                                    options={homeworkChartOptions} // 수정된 옵션 적용
                                />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lecture_State;
