
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DateTimePicker from '@react-native-community/datetimepicker';
import { windowHeight } from '../utils/Dimensions';


import block from '../data/block.json';

import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    FlatList,
} from 'react-native';

const customDate = new Date();
const year = customDate.getFullYear();
const month = customDate.getMonth() + 1;
const day = customDate.getDate();

const cur_date = year + '-' + month + '-' + day;

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const VisitedScreen = ({ navigation, }, props) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [DATA, setDATA] = useState([]);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    let showDate = cur_date;

    const onChange = (selectedDate) => {
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

        fetchData();

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        showMode('date');
        console.log("BLOCKS : ", block.blocks);
        wait(500).then(() => setRefreshing(false));
    }, []);

    const fetchData = () => {
        const tmpDATA = [];
        block.blocks.forEach(function (element, index) {
            const routeIndex = index.toString();
            const placeTime = (element.date.split('-'));

            if (showDate == placeTime[0] + '-' + placeTime[1] + '-' + placeTime[2]) {
                const visitedTime = placeTime[0] + "년 " + placeTime[1] + "월 " + placeTime[2] + "일 " + placeTime[3] + "시 " + placeTime[4] + "분";

                const routeDict = { id: routeIndex, title: element.store_id, subtitle: visitedTime };
                tmpDATA.unshift(routeDict);
            }
        })
        setDATA(tmpDATA);
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={{
                borderBottomColor: "#007FFF",
                borderBottomWidth: 0.7,
                flexDirection: 'row',
            }}>
                <Text style={styles.subtitle}>{item.subtitle} 에 방문</Text>
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
                <Text style={styles.title}>{item.title}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>지난 체크인 기록</Text>
                </View>
                <Image
                    source={require('../assets/menu_route.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>

            <View>
                <View style={{ alignItems: "center", top: 20 }}>
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
                </View>
            </View>

            <View style={{ marginTop: 20, marginBottom: 30, flex: 1 }}>
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
                                <Text style={{ top: 5, textAlign: 'center', fontSize: 20, fontWeight: '300', color: '#777' }}>블루투스 체크인을 진행하고, 나의 방문 기록을 간편하게 확인해보세요!</Text>
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
    );
}

export default VisitedScreen;

const styles = StyleSheet.create({
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
});
