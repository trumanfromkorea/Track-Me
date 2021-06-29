/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Icon, Input } from 'semantic-ui-react'
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

const columns = ["확진자 번호", "전화번호", "확진 날짜", "동선파악 여부", "접촉자 분류 여부", "완치 여부"]

const PatientManagePage = () => {
  // setlist 를 해주기 위한 공백 리스트
  const tmpArr = [];
  // return 부 내에서 반환해줄 state
  const [printlist, setPrintlist] = useState([]);
  // 확진자 정보를 가져오는 함수
  const [inputs, setInputs] = useState({ searchValue: '' });
  const { value } = inputs;
  // 전화번호 검색에 사용하는 리스트
  const searchTmp = [];
  const [searchPrintlist, setSearchPrintlist] = useState([]);
  // 임시 유저 block 리스트
  const user_block = {};
  const [blockKeylist, setUserBlockKeylist] = useState([]);
  // 임시 매장 block 리스트
  const store_block = {};
  const [tempStoreBlocklist, setStoreBlockKeylist] = useState([]);

  const [refresh, setRefresh] = useState(false);
  const limitation = useRef(5);


  // 확진자 정보 관리 메인 테이블 부분
  const getPatient = async () => {
    // 파이어베이스 접근 후 확진자 가져오는 부분
    await db.collection("patientInfo")
      .orderBy("confirmedNum", "desc")
      .limit(limitation.current)
      .get()
      .then((querySnapshot) => {

        // 반복문 실행
        querySnapshot.forEach((doc) => {
          // 색깔 정의
          const r_color = doc.data().checkedTrace ? "green" : "red";
          const d_color = doc.data().checkedContact ? "green" : "red";
          const h_color = doc.data().checkedTreatment ? "green" : "red";

          const phone = doc.data().userPhone;

          // 공백 리스트에 테이블 소스를 push
          tmpArr.push(
            <tr>
              <td>{"#" + doc.data().confirmedNum}</td>
              <td>{phone.substring(0, 3) + '-' + phone.substring(3, 7) + '-' + phone.substring(7, 11)}</td>
              <td>{doc.data().confirmedDate}</td>
              <td style={{ color: r_color }}>{doc.data().checkedTrace ? "완료" : "미완료"}</td>
              <td style={{ color: d_color }}>{doc.data().checkedContact ? "완료" : "미완료"}</td>
              <td style={{ color: h_color }}>{doc.data().checkedTreatment ? "격리 해제" : "치료 중"}</td>
            </tr>
          )
        })
      })
    setPrintlist(tmpArr);
  }

  useEffect(() => {
    getPatient();
    console.log("refreshed");
    setRefresh(false);
  }, [refresh])

  // 전화번호 검색 부분
  const handleSearchChange = async (e) => {
    const { value, results } = e.target
    const nextInputs = { ...inputs, [value]: results }
    setInputs(nextInputs)

    await db.collection("patientInfo")
      .get()
      .then((querySnapshot) => {
        // 반복문 실행
        querySnapshot.forEach((doc) => {
          // 색깔 정의 
          const r_color = doc.data().checkedTrace ? "green" : "red";
          const d_color = doc.data().checkedContact ? "green" : "red";
          const h_color = doc.data().checkedTreatment ? "green" : "red";

          const phone = doc.data().userPhone;
          // 전화번호가 같은 리스트만 push
          if (doc.data().userPhone == value) {
            searchTmp.push(
              <tr>
                <td>{"#" + doc.data().confirmedNum}</td>
                <td>{phone.substring(0, 3) + '-' + phone.substring(3, 7) + '-' + phone.substring(7, 11)}</td>
                <td>{doc.data().confirmedDate}</td>
                <td style={{ color: r_color }}>{doc.data().checkedTrace ? "완료" : "미완료"}</td>
                <td style={{ color: d_color }}>{doc.data().checkedContact ? "완료" : "미완료"}</td>
                <td style={{ color: h_color }}>{doc.data().checkedTreatment ? "격리 해제" : "치료 중"}</td>
              </tr>
            )
          }
        })
      })
    setSearchPrintlist(searchTmp);
  }

  // 신규 확진자 가져와서 검증하기
  const handleClick = async () => {
    // 신규 확진자 블록 가져오기 (앱에서)
    // dic dic

    // await db.collection("tempConfirmedUserBlock")
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       user_block[doc.id] = doc.data();
    //     })
    //   })
    // setUserBlockKeylist(user_block);

    // // 신규 확진자 블록 가져오기 (매장에서)
    // // dic dic
    // await db.collection("tempConfirmedStoreBlock")
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       store_block[doc.id] = doc.data();
    //     })
    //   })
    // setStoreBlockKeylist(store_block);

    // // 2중 for문을 사용하여 사용자 앱에서 가져온 블록과
    // // 매장에서 가져온 블록을 비교
    // // ct 를 0으로 초기화 시키고 다를 때 ct++ 하여서 비교
    // for (var key1 in user_block) { // key1 = 유저 아이디
    //   var ct = 0;
    //   for (var key2 in user_block[key1]) { // key2 = 인덱스
    //     // JSON.parse(string) << JSON 형태 문자열을 JSON 으로 파싱
    //     var block = JSON.parse(user_block[key1][key2]);
    //     console.log(block);
    //     if (block["hash"] != store_block[key1][key2]) {
    //       // 이 부분에서 블록 불일치하면 ct++
    //       ct++;
    //     }
    //   }

    //   // ct가 0인 경우 검증통과 하고 다음 작업 진행
    //   if (ct == 0) {
    //     console.log("사용자 ", key1, "님의 검증 통과");

    //     let latitude;
    //     let longitude;
    //     let buisnessPhone;
    //     let buisnessAddress;

    //     let visitedTime = block.date;
    //     let buisnessName = block.store_id;

    //     await db.collection("buisnessInfo")
    //       .doc(block.store_id)
    //       .get()
    //       .then((doc) => {
    //         latitude = doc.data().latitude;
    //         longitude = doc.data().longitude;
    //         buisnessPhone = doc.data().buisnessPhone;
    //         buisnessAddress = doc.data().buisnessAddress;
    //       })

    //     let userPhone;
    //     await db.collection("userInfo")
    //       .doc(key1)
    //       .get()
    //       .then((doc) => {
    //         userPhone = doc.data().userPhone;
    //       })

    //     db.collection('patientVisited')
    //       .doc(block.store_id)
    //       .set({
    //         latitude: latitude,
    //         longitude: longitude,
    //         visitedTime: visitedTime,
    //         buisnessName: buisnessName,
    //         buisnessAddress: buisnessAddress,
    //         buisnessPhone: buisnessPhone,
    //       });

    //     let docSize;
    //     await db.collection('patientInfo')
    //       .get().then((doc) => {
    //         docSize = doc.size;
    //       })

    //     let current_date = new Date();
    //     let year = current_date.getFullYear();
    //     let month = current_date.getMonth() + 1;
    //     let day = current_date.getDate();
    //     let hour = current_date.getHours();
    //     let minute = current_date.getMinutes();

    //     const confirmedDate = year + "-" + month + "-" + day + "-" + hour + "-" + minute;

    //     db.collection('patientInfo')
    //       .doc(key1)
    //       .set({
    //         checkedContact: true,
    //         checkedTrace: true,
    //         checkedTreatment: false,
    //         confirmedDate: confirmedDate,
    //         confirmedNum: ++docSize,
    //         userPhone: userPhone,
    //       });


    //     // delete하여 temp 비우기
    //     await db.collection("tempConfirmedUserBlock")
    //       .doc(key1)
    //       .delete()
    //       .then(() => {
    //         console.log(key1, "님의 tempConfirmedUserBlock 삭제 완료!");
    //       });

    //     await db.collection("tempConfirmedStoreBlock")
    //       .doc(key1)
    //       .delete()
    //       .then(() => {
    //         console.log(key1, "님의 tempConfirmedStoreBlock 삭제 완료!");
    //       });

    //   } else { // ct 가 0이 아닌 경우 조작 의심
    //     console.log("사용자 ", key1, "님 조작 의심");
    //   }
    // }
    alert("금일 접촉자 분류가 완료되었습니다.");
    setRefresh(true);
  }

  const handleMore = () => {
    console.log("more!");
    limitation.current += 5;
    setRefresh(true);
  }

  return (
    <div className="paddingAll">
      <Table id="table3">
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

      <Input className="contentSearch1"
        icon={{ name: 'search', circular: true, link: false }}
        placeholder='전화번호 검색'
        onChange={handleSearchChange}
        value={value}
      />

      <Button animated='fade' className="button1" onClick={handleClick}>
        <Button.Content visible>금일 접촉자 분류하기</Button.Content>
        <Button.Content hidden><Icon name='checkmark' /></Button.Content>
      </Button>

      <Table id="table2">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {searchPrintlist}
        </tbody>
      </Table>

      <Button animated='fade' id="button3" onClick={handleMore}>
        <Button.Content visible>더보기</Button.Content>
        <Button.Content hidden><Icon name='arrow down' /></Button.Content>
      </Button>

    </div>
  )
}

export default PatientManagePage;