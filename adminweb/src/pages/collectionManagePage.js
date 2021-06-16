/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Button, Table, Icon, Menu, Input } from 'semantic-ui-react'
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


const collectionManagePage = () => {
    const [refresh, setRefresh] = useState(false);
    const [printlist, setPrintlist] = useState([]);
    const tmpArr = [];
    const columns = ["확진자 방문 장소", "방역 여부", "상태 변경"]
    const searchTmp = [];
    const [searchPrintlist, setSearchPrintlist] = useState([]);
    const [inputs, setInputs] = useState({ searchValue: '' });
    const { value } = inputs;

    const changeState = (name) => {
        console.log(name);
        db.collection("patientVisited")
            .doc(name)
            .update({
                sanitized: true,
            })
            .then(console.log("changed!!!"))
        alert(name + " 매장의 방역 상태가 변경되었습니다.");
        setRefresh(true);
    }

    const getVisited = async () => {

        await db.collection("patientVisited")
            .orderBy("visitedTime", "desc")
            .get()
            .then((querySnapshot) => {

                // 반복문 실행
                querySnapshot.forEach((doc) => {
                    // 색깔 정의
                    const sanColor = doc.data().sanitized ? "green" : "red";

                    // 공백 리스트에 테이블 소스를 push
                    tmpArr.push(
                        <tr>
                            <td>{doc.data().buisnessName}</td>
                            <td style={{ color: sanColor }}>{doc.data().sanitized ? "완료" : "미완료"}</td>
                            <td><Button onClick={() => { changeState(doc.data().buisnessName) }}>방역 완료</Button></td>
                        </tr>
                    )
                })
            })
        setPrintlist(tmpArr);
    }

    const handleDelete = async () => {
        let dateDict = {};
        await db.collection("patientVisited")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    dateDict[doc.data().buisnessName] = doc.data().visitedTime;
                })
            });

        var delList = [];
        for (var key in dateDict) {
            console.log(key);
            const calDate = dateDict[key].split('-');
            console.log(calDate);

            var month = new Date().getMonth() + 1;
            var day = new Date().getDate();
            console.log(calDate[1], month);
            console.log(calDate[2], day);
            if (calDate[1] == month && Number(calDate[2]) + 14 <= day) {
                delList.push(key);
            }
            if (calDate[1] != month && day + 30 - Number(calDate[2]) >= 14) {
                delList.push(key);
            }
        }

        delList.forEach((element) => {
            db.collection('patientVisited')
                .doc(element)
                .delete()
        })
        alert("기간이 만료된 방문정보가 삭제되었습니다.")
        setRefresh(true);
    }

    useEffect(() => {
        getVisited();
        setRefresh(false);
    }, [refresh])

    const handleSearchChange = async (e) => {
        const { value, results } = e.target
        const nextInputs = { ...inputs, [value]: results }
        setInputs(nextInputs)

        await db.collection("patientVisited")
            .get()
            .then((querySnapshot) => {
                // 반복문 실행
                querySnapshot.forEach((doc) => {
                    const sanColor = doc.data().sanitized ? "green" : "red";
                    if (doc.data().buisnessName == value) {
                        // 공백 리스트에 테이블 소스를 push
                        searchTmp.push(
                            <tr>
                                <td>{doc.data().buisnessName}</td>
                                <td style={{ color: sanColor }}>{doc.data().sanitized ? "완료" : "미완료"}</td>
                                <td><Button onClick={() => { changeState(doc.data().buisnessName) }}>방역 완료</Button></td>
                            </tr>
                        )
                    }
                })
            })
        setSearchPrintlist(searchTmp);
    }

    return (
        <div>
            <Table id="table1">
                <thead>
                    <tr>
                        <th>확진자 방문 장소</th>
                        <th>방역 여부</th>
                        <th>상태 변경</th>
                    </tr>
                </thead>
                <tbody>
                    {printlist}
                </tbody>
            </Table>
            <Button animated='fade' className="button2" onClick={handleDelete}>
                <Button.Content visible>지난 동선 삭제하기</Button.Content>
                <Button.Content hidden><Icon name='search plus' /></Button.Content>
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

            <Input className="contentSearch2"
                icon={{ name: 'search', circular: true, link: false }}
                placeholder='매장명 검색'
                onChange={handleSearchChange}
                value={value}
            />
        </div>
    )
}

export default collectionManagePage;