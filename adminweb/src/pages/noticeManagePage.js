/* eslint-disable */
import React, { useState } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react';
//import axios from 'axios';

import firebase from 'firebase'

var firebaseConfig = {
    // GET YOUT OWN CONFIG FROM FIREBASE

};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
else {
    firebase.app();
}

var db = firebase.firestore();

const customDate = new Date();
const year = customDate.getFullYear();
const month = customDate.getMonth() + 1;
const day = customDate.getDate();

const cur_date = year + '년 ' + month + '월 ' + day + '일';

const NoticeManagePage = () => {

    const [text, setText] = useState('');

    const message_1 = "신규 확진자 방문 장소가 업데이트 되었습니다. 주변 상황을 지도에서 확인하시고, 안전에 유의하시길 바랍니다.";
    const message_2 = "사용자님께서는 밀접 접촉자로 확인되셨습니다. 빠른 시일 내 검사 후 안내 사항에 따라 임시 자택대기 해주시길 바랍니다.";
    const message_3 = "동선 공유가 완료되었습니다. 개인 정보는 공개되지 않으니 안심하시고, 조속히 완쾌하시길 기원합니다.";

    const title_1 = "신규 확진자 알림";
    const title_2 = "밀접 접촉자 안내";
    const title_3 = "동선 공유 완료"

    const handleSearch = (e) => {
        setText(e.target.value);
        console.log(text);
    }

    const sendData = async () => {
        console.log("message : ", text);
        // const response = await axios.post('https://901a982db9e8.ngrok.io/message', {
        //     title: "공지사항",
        //     body: text
        // })
        db.collection('notifications').add({
            title: "공지사항",
            description: text,
            dateTime: cur_date,
            source: "new_notice"
        })
    }

    const sendBasicData = async (sendTitle, sendMessage, src) => {
        // const response = await axios.post('https://901a982db9e8.ngrok.io/message', {
        //     title: sendTitle,
        //     body: sendMessage
        // })
        db.collection('notifications').add({
            title: sendTitle,
            description: sendMessage,
            dateTime: cur_date,
            source: src
        })
    }

    return (
        <>
            <Form>
                <h3 id="noticeTextAreaTitle">메세지 직접 입력하기</h3>
                <TextArea id="noticeTextArea" placeholder='알림 내용을 입력하세요.' onChange={handleSearch} />
                <Button primary id="noticeButton" onClick={() => { sendData() }}>전송</Button>
            </Form>

            <Form>
                <h3 id="enteredNoticeTextAreaTitle1">사용자 대상 알림</h3>
                <TextArea id="enteredNoticeTextArea1" value={message_1} />
                <Button primary id="enteredNoticeButton1" onClick={() => { sendBasicData(title_1, message_1, "update") }}>전송</Button>
            </Form>

            <Form>
                <h3 id="enteredNoticeTextAreaTitle2">자가격리자 대상 알림</h3>
                <TextArea id="enteredNoticeTextArea2" value={message_2} />
                <Button primary id="enteredNoticeButton2" onClick={() => { sendBasicData(title_2, message_2, "detected") }}>전송</Button>
            </Form>

            <Form>
                <h3 id="enteredNoticeTextAreaTitle3">확진자 대상 알림</h3>
                <TextArea id="enteredNoticeTextArea3" value={message_3} />
                <Button primary id="enteredNoticeButton3" onClick={() => { sendBasicData(title_3, message_3, "check") }}>전송</Button>
            </Form>
        </>
    )
}

export default NoticeManagePage;