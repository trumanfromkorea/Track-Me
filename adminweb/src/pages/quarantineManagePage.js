/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Icon } from 'semantic-ui-react'
import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyCf6G8TDQC4gML05q9VqajOnHlF9T2x66I",
  authDomain: "userapp-c55de.firebaseapp.com",
  projectId: "userapp-c55de",
  storageBucket: "userapp-c55de.appspot.com",
  messagingSenderId: "599352656145",
  appId: "1:599352656145:web:a7a442a399dd01e726ccb0"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
else {
  firebase.app();
}

var db = firebase.firestore();

const columns = ["자가격리자 번호", "격리 시작 날짜", "자가격리 여부", "확진 여부"]


const QuarantineManagePage = () => {

  // setlist 를 해주기 위한 공백 리스트
  const tmpArr = [];
  // return 부 내에서 반환해줄 state
  const [printlist, setPrintlist] = useState([]);

  const [refresh, setRefresh] = useState(false);
  const limitation = useRef(10);
  // 확진자 정보를 가져오는 함수
  const getPatient = async () => {
    // 파이어베이스 접근 후 확진자 가져오는 부분
    await db.collection("quarantineInfo")
      .limit(limitation.current)
      .orderBy("quarantinedNum", "desc")
      .get()
      .then((querySnapshot) => {
        // 반복문 실행
        querySnapshot.forEach((doc) => {
          // 색깔 정의 
          const r_color = doc.data().checkedConfirm ? "red" : "green";
          const h_color = doc.data().checkedRelease ? "green" : "red";
          const con_date = (doc.data().quarantinedTime).split('-');
          // 공백 리스트에 테이블 소스를 push
          tmpArr.push(
            <tr>
              <td> {"#" + doc.data().quarantinedNum} </td>
              <td>{con_date[0] + "년 " + con_date[1] + "월 " + con_date[2] + "일"}</td>
              <td style={{ color: h_color }}>{doc.data().checkedRelease ? "해제" : "격리중"}</td>
              <td style={{ color: r_color }}>{doc.data().checkedConfirm ? "양성" : "음성"}</td>
            </tr>
          );
        })
      })
    setPrintlist(tmpArr);
  }

  useEffect(() => {
    getPatient();
    console.log("refreshed");
    setRefresh(false);
  }, [refresh])

  const handleMore = () => {
    console.log("more!");
    limitation.current += 10;
    setRefresh(true);
  }

  return (
    <div>
      <Table id="table2">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {printlist}
        </tbody>

      </Table>

      <Button animated='fade' id="button4" onClick={handleMore}>
        <Button.Content visible>더보기</Button.Content>
        <Button.Content hidden><Icon name='arrow down' /></Button.Content>
      </Button>

    </div>
  )
}

export default QuarantineManagePage;