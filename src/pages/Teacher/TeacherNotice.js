import React, { useState } from 'react';
import "./TeacherNotice.css";

const TeacherNotice = () => {
    const [openItem, setOpenItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleDropdown = (index) => {
        setOpenItem(openItem === index ? null : index);
    };

    const toggleCheckbox = (index) => {
        setSelectedItems(prev =>
            prev.includes(index)
                ? prev.filter(item => item !== index)
                : [...prev, index]
        );
    };

    const faqItems = [
        {
            title: "사이트 점검 안내",
            date: "2024-07-23",
            content: `
                대성전은 설수하지 않는다 다만 자비를 베풀 뿐
                대성전은 태어나고 이미니게 말했다 '물지 마라'
                대성전은 최후하면 곤생할이 곧난다.
            `,
            attachment: "7월 공지사항.pdf"
        },
        {
            title: "사이트 점검 안내",
            date: "2024-07-23",
            content: `
                대성전은 설수하지 않는다 다만 자비를 베풀 뿐
                대성전은 태어나고 이미니게 말했다 '물지 마라'
                대성전은 최후하면 곤생할이 곧난다.
            `,
            attachment: "7월 공지사항.pdf"
        },{
            title: "사이트 점검 안내",
            date: "2024-07-23",
            content: `
                대성전은 설수하지 않는다 다만 자비를 베풀 뿐
                대성전은 태어나고 이미니게 말했다 '물지 마라'
                대성전은 최후하면 곤생할이 곧난다.
            `,
            attachment: "7월 공지사항.pdf"
        },{
            title: "사이트 점검 안내",
            date: "2024-07-23",
            content: `
                대성전은 설수하지 않는다 다만 자비를 베풀 뿐
                대성전은 태어나고 이미니게 말했다 '물지 마라'
                대성전은 최후하면 곤생할이 곧난다.
            `,
            attachment: "7월 공지사항.pdf"
        },{
            title: "사이트 점검 안내",
            date: "2024-07-23",
            content: `
                대성전은 설수하지 않는다 다만 자비를 베풀 뿐
                대성전은 태어나고 이미니게 말했다 '물지 마라'
                대성전은 최후하면 곤생할이 곧난다.
            `,
            attachment: "7월 공지사항.pdf"
        },{
            title: "사이트 점검 안내",
            date: "2024-07-23",
            content: `
                대성전은 설수하지 않는다 다만 자비를 베풀 뿐
                대성전은 태어나고 이미니게 말했다 '물지 마라'
                대성전은 최후하면 곤생할이 곧난다.
            `,
            attachment: "7월 공지사항.pdf"
        },
        // 필요한 만큼 FAQ 항목을 추가하세요
    ];

    return (
        <div className="teacher_teacher_notice_container">
            <div className="teacher_teacher_notice_title_box">
                <h1 className="teacher_teacher_notice_page_title">강사 공지사항</h1>
                <div className="teacher_teacher_notice_button_container">
                    <button className="teacher_teacher_notice_button">등록</button>
                    <button className="teacher_teacher_notice_button">삭제</button>
                </div>
            </div>
            <div className="faq_list">
                <div className="faq_list_box">
                    {faqItems.map((item, index) => (
                        <div key={index} className="faq_list_item">
                            <div className="faq_list_item_box" onClick={() => toggleDropdown(index)}>
                                <div className="faq_list_item_box_left">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(index)}
                                        onChange={() => toggleCheckbox(index)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="faq_list_item_box_notice">공지</span>
                                    <span className="faq_list_item_box_title">{item.title}</span>
                                </div>
                                <div className="faq_list_item_box_right">
                                    <span className="faq_list_item_box_date">{item.date}</span>
                                    <button className="faq_list_item_box_moreBtn">
                                        <i className={`fa-solid ${openItem === index ? 'fa-minus' : 'fa-plus'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className={`faq_list_item_detail ${openItem === index ? 'open' : ''}`}>
                                <span className="faq_list_item_detail_content">{item.content}</span>
                                {item.attachment && (
                                    <div className="faq_list_item_attachment">
                                        <a href={`#${item.attachment}`}>{item.attachment}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherNotice;