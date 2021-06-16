
import React, { useContext, useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DateTimePicker from '@react-native-community/datetimepicker';
import { windowHeight, windowWidth } from '../utils/Dimensions';

import {
    RefreshControl,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    Button,
    FlatList,
    ScrollView,
} from 'react-native';

import axios from 'axios';
import block from '../data/block.json';
import { time } from 'node:console';

const Drawer = createDrawerNavigator();

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const customDate = new Date();
const year = customDate.getFullYear();
const month = customDate.getMonth() + 1;
const day = customDate.getDate();

const cur_date = year + '-' + month + '-' + day;

const Visited = ({ navigation }) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [DATA, setDATA] = React.useState([]);
    // const index = useRef(0);

    const [timePicked, setTimePicked] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(true);

    let showDate = cur_date;

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        const pickedYear = currentDate.getFullYear().toString();
        const pickedMonth = (currentDate.getMonth() + 1).toString();
        const pickedDay = currentDate.getDate().toString();

        const pickedTime = (currentDate.toString().split(" ")[4]).split(":");
        const pickedHour = pickedTime[0];
        const pickedMin = pickedTime[1];

        showDate = pickedYear + '-' + pickedMonth + '-' + pickedDay;
        showTime = pickedHour + '-' + pickedMin;

        console.log(showDate + '-' + showTime);

        if (timePicked) {
            let index = 0;
            const tmpDATA = [];
            const visitors = [];

            (block[showDate].blocks).forEach((element) => {
                const timestamp = (element.date).split('-');
                const calMinutes = Number(timestamp[3]) * 60 + Number(timestamp[4]);
                const stdMinutes = Number(pickedHour) * 60 + Number(pickedMin);
                console.log(calMinutes, stdMinutes);
                if (stdMinutes + 60 >= calMinutes) {
                    console.log(timestamp[3], timestamp[4]);
                    index += 1;
                    const routeDict = { id: index, visitedTime: element.date };
                    tmpDATA.push(routeDict);
                }
            })
            setDATA(tmpDATA);
            console.log(DATA);
            setTimePicked(false);
        }

        fetchData();

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
        setTimePicked(true);
    };


    // const DATA = [];

    const fetchData = async () => {
        let index = 0;
        const tmpDATA = [];
        const visitors = [];

        const response = await axios.post('https://3f6a6203d8e7.ngrok.io/send');

        console.log(response.data);

        visitors.push(response.data);

        block[cur_date].blocks.push(response.data);
        console.log("Block :", (block[cur_date].blocks));
         
        (block[showDate].blocks).forEach((element) => {
            index += 1;
            const routeDict = { id: index, visitedTime: element.date };
            console.log(element.date);
            tmpDATA.unshift(routeDict);
        })
        setDATA(tmpDATA);
        // console.log("DATA", DATA);
        // 만약 저장 안되면
        // RNFS.writeFile("../data/block.json",block,'utf8')
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        wait(500).then(() => setRefreshing(false));
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={{
                borderBottomColor: "#007FFF",
                borderBottomWidth: 0.7,
                flexDirection: 'row',
            }}>
                <Text style={styles.subtitle}>{item.visitedTime} 에 방문</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
                marginTop: 5
            }}>
                <Image
                    source={require('../assets/menu_check.png')}
                    style={{ width: 27, height: 27, marginRight: 3, tintColor: "#668ffd" }}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{item.id}번 방문자</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>방문자 관리</Text>
                </View>
                <Image
                    source={require('../assets/service.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>
            <View style={{ alignItems: "center", top: 10 }}>
                <View>
                    <View style={{ justifyContent: "center", flexDirection: 'row', top: 10 }}>
                        <View style={{ width: 130 }}>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                    style={{}}
                                />
                            )}
                        </View>
                        <View style={{ width: 70 }}>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={'time'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                    style={{}}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 30, marginBottom: 30, flex: 1 }}>

                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>
                    {(DATA.length == 0) &&
                        <View style={{ flex: 1, marginTop: 150, alignItems: 'center' }}>
                            <Image
                                source={require('../assets/emptyList.png')}
                                style={{ width: 100, height: 100, marginBottom: 15 }}
                                resizeMode="contain"
                            />
                            <View style={{ marginHorizontal: 40 }}>
                                <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '600', color: '#444' }}>방문기록이 없습니다.</Text>
                                <Text style={{ top: 5, textAlign: 'center', fontSize: 20, fontWeight: '300', color: '#777' }}>오늘의 방문자가 아직 없습니다. 날짜별, 시간대별 방문자를 간편하게 파악해보세요!</Text>
                            </View>
                        </View>
                    }

                    <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </ScrollView>
            </View>
        </View>
    )
}

export default Visited;

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 5,
        marginHorizontal: 5,
        marginTop: 10,
        width: '40%',
        height: windowHeight / 18,
        backgroundColor: '#0088F7',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    floatingHeader: {
        marginTop: Platform.OS === 'ios' ? 50 : 20,
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    headerText: {
        color: "black",
        flex: 1,
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: "column",
        borderBottomColor: "#ccc",
        shadowColor: '#888',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        fontSize: 20,
        color: "#000069",
        fontWeight: "400"
    },
    subtitle: {
        fontSize: 16,
        color: "#587199",
        fontWeight: "300"
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },
});