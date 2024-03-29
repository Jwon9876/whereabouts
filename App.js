import React, {useEffect, useState, useRef} from 'react';
import {Text, TextInput, Animated, View} from 'react-native';

import axios from 'axios';
import styled from 'styled-components';
import {API_KEY} from '@env';

import MetroResponse from './MetroResponse';

const App = () => {
    const [realTimeStationArrival, setRealTimeStationArrival] = useState([]);
    const [searchWord, setsearchWord] = useState('');

    const getRealTimeStationArrival = async searchWord => {
        await axios
            .get(
                `http://swopenapi.seoul.go.kr/api/subway/${API_KEY}/json/realtimeStationArrival/0/6/${searchWord}`,
            )
            .then(response => {
                console.log(JSON.stringify(response, null, 4));
                console.log(response.data.realtimeArrivalList);
                const realtimeArrivalList = response.data.realtimeArrivalList;
                const sortedRealtimeArrivalList = realtimeArrivalList.sort(
                    (a, b) => {
                        if (parseInt(a.subwayId) > parseInt(b.subwayId)) {
                            return 1;
                        }
                        return -1;
                    },
                );
                setRealTimeStationArrival(sortedRealtimeArrivalList);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const expectedArrivalTime = sec => {
        const minute = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minute}분 ${seconds}초`;
    };

    const [rotateAnimation, setRotateAnimation] = useState(
        new Animated.Value(0),
    );

    const handleAnimation = () => {
        Animated.timing(rotateAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            rotateAnimation.setValue(0);
        });
    };

    const interpolateRotating = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
    });

    return (
        <SafeAreaView>
            <SearchBar>
                <TextInput
                    style={TextInputStyle}
                    placeholder={'역 명을 입력하세요.'}
                    placeholderTextColor={'#626262'}
                    onChangeText={setsearchWord}
                    onSubmitEditing={() =>
                        getRealTimeStationArrival(searchWord)
                    }
                />
                <RefreshBtn
                    onPress={() => {
                        getRealTimeStationArrival(searchWord),
                            handleAnimation();
                    }}>
                    <Animated.Image
                        source={require('../whereabouts/Assets/refreshIcon.png')}
                        style={{
                            width: 25,
                            height: 25,
                            transform: [
                                {
                                    rotate: interpolateRotating,
                                },
                            ],
                        }}
                    />
                </RefreshBtn>
            </SearchBar>
            <ScrollView>
                <RealTimeStationArrivalView>
                    {realTimeStationArrival.map((v, i) => (
                        <MetroArrivalInfoView key={i}>
                            <View
                                style={{
                                    width: 80,
                                    borderTopLeftRadius: 15,
                                    borderBottomLeftRadius: 15,
                                    backgroundColor:
                                        MetroResponse.metroLineColor[
                                            MetroResponse.metroLine[v.subwayId]
                                        ],
                                    opacity: 0.8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 40,
                                        fontWeight: 'bold',
                                        color: 'black',
                                        opacity: 0.8,
                                    }}>
                                    {MetroResponse.metroLineNumber[v.subwayId]}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: MetroResponse.metroLineColor[
                                            MetroResponse.metroLine[v.subwayId]
                                        ],
                                    }}>
                                    {MetroResponse.metroLine[v.subwayId]}{' '}
                                    {v.updnLine}
                                </Text>
                                <Text>
                                    {v.trainLineNm} {v.btrainNo}{' '}
                                </Text>
                                {v.barvlDt !== '0' ? (
                                    <Text>
                                        열차도착예정시간:{' '}
                                        {expectedArrivalTime(v.barvlDt)}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                <Text>현재 위치: {v.arvlMsg3}</Text>
                                <Text>현재 상태: {v.arvlMsg2}</Text>
                                <Text>
                                    도착코드:{' '}
                                    {MetroResponse.arrivalCode[v.arvlCd]}
                                </Text>
                            </View>
                        </MetroArrivalInfoView>
                    ))}
                </RealTimeStationArrivalView>
            </ScrollView>
        </SafeAreaView>
    );
};

const SafeAreaView = styled.SafeAreaView`
    flex: 1;
    background: #0080ff;
`;

const ScrollView = styled.ScrollView``;

const SearchBar = styled.View`
    background: #0080ff;
    flex-direction: row;
    align-items: center;
`;

const TextInputStyle = {
    width: '85%',
    height: 35,
    borderWidth: 2,
    borderColor: '#00adff',
    borderRadius: 15,
    marginLeft: 10,
    padding: 7,
    backgroundColor: '#fff',
};

const RefreshBtn = styled.TouchableOpacity`
    position: absolute;
    right: 15px;
`;

const Hr = styled.View`
    width: 100%;
    height: 3px;
    background-color: #b3b3b3;
`;

const RealTimeStationArrivalView = styled.View`
    justify-content: center;
    align-items: center;
`;

const MetroArrivalInfoView = styled.View`
    margin-top: 10px;
    border-radius: 15px;
    width: 95%;
    background: #ffffff;
    flex-direction: row;
`;

export default App;
