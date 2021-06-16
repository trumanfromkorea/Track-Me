
import React, { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
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

import new_notice from '../assets/new_notice.png';
import detected from '../assets/detected.png';
import update from '../assets/update.png';
import check from '../assets/menu_check.png';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const NoticeScreen = ({ navigation }) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const [DATA, setDATA] = useState([]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        wait(500).then(() => setRefreshing(false));
    }, []);

    const fetchData = async () => {
        let tmpDATA = [];
        await firestore().collection('notifications')
            .orderBy('dateTime', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    tmpDATA.push(doc.data());
                })
            });
        setDATA(tmpDATA);
    }

    const source = 'new_notice';

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <Image
                    source={item.source == "update" ? update : (item.source == "detected" ? detected : (item.source == "new_notice" ? new_notice : check))}
                    style={{ width: 27, height: 27, marginRight: 6, tintColor: item.source == "check" ? "#668ffd" : null }}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={{ marginTop: 3 }}>

                <Text style={styles.subtitle}>{item.description}</Text>
                <Text style={styles.dateTime}>{item.dateTime}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>알림</Text>
                </View>
                <Image
                    source={require('../assets/new_notice.png')}
                    style={{ width: 30, height: 30, tintColor: "black" }}
                    resizeMode="contain"
                />
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
                                source={require('../assets/no_notifications.png')}
                                style={{ width: 100, height: 100, marginBottom: 15 }}
                                resizeMode="contain"
                            />
                            <View style={{ marginHorizontal: 40 }}>
                                <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '600', color: '#444' }}>알림이 없습니다.</Text>
                                <Text style={{ top: 5, textAlign: 'center', fontSize: 20, fontWeight: '300', color: '#777' }}>Track Me 에서 제공하는 알림, 업데이트 정보를 한 눈에 파악해보세요!</Text>
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

export default NoticeScreen;

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
        marginVertical: 5,
        borderRadius: 10,
        marginHorizontal: 16,
        flexDirection: "column",
        borderBottomColor: "#ccc",
        shadowColor: '#aaa',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        fontSize: 17,
        color: "#000069",
        fontWeight: "600"
    },
    subtitle: {
        fontSize: 16,
        color: "#587199",
        fontWeight: "400"
    },
    dateTime: {
        top: 6,
        fontSize: 13,
        color: "#888",
        fontWeight: "300"
    },
});