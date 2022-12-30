/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	useColorScheme,
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import axios from 'axios';
import styled from 'styled-components';
import { API_KEY } from '@env'




const App = () => {

	const [realTimeStationArrival, setRealTimeStationArrival] = useState([]);
	const [searchWord, setsearchWord] = useState("")

	const arrivalcode = {
		"0":"진입",
		"1":"도착", 
		"2":"출발", 
		"3":"전역출발", 
		"4":"전역진입", 
		"5":"전역도착", 
		"99":"운행중"
	}

	const metroLine = {
		"1001": "1호선",
		"1002": "2호선",
		"1003": "3호선",
		"1004": "4호선",
		"1005": "5호선",
		"1006": "6호선",
		"1007": "7호선",
		"1008": "8호선"
	}

	const getRealTimeStationArrival = async (searchWord) => {
		await axios.get(`http://swopenapi.seoul.go.kr/api/subway/${API_KEY}/json/realtimeStationArrival/0/6/${searchWord}`)
			.then((response) => {
				console.log(response.data.realtimeArrivalList)
				setRealTimeStationArrival(response.data.realtimeArrivalList)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const expectedArrivalTime = (sec) => {
		const minute = Math.floor(sec / 60);
		const seconds = sec % 60;
		return `${minute}분 ${seconds}초`;
	}

	useEffect(() => {
		realTimeStationArrival.sort((a, b) => {
			if(parseInt(a.subwayId) > parseInt(b.subwayId)){
				return 1;
			} else{
				return -1;
			}
		})
	}, [realTimeStationArrival])

	return (
		<SafeAreaView>
			<SearchBar>
				<TextInput
					style={TextInputStyle}
					onChangeText={(e) => setsearchWord(e)}
					onEndEditing = {() => getRealTimeStationArrival(searchWord)}
				/>
			</SearchBar>
			<ScrollView>
			{
				realTimeStationArrival.map((v, i) => 
				
					<View key={i}>
						<Text> 지하철호선ID: {metroLine[v.subwayId]}</Text>
						<Text> 상하행선구분: {v.updnLine}</Text>
						<Text> 도착지방면: {v.trainLineNm}</Text>
						<Text> 지하철역ID: {v.statnId}</Text>
						<Text> 지하철역명: {v.statnNm}</Text>
						<Text> 도착예정열차순번: {v.ordkey}</Text>
						<Text> 열차도착예정시간: {expectedArrivalTime(v.barvlDt)}</Text>
						<Text> 열차번호: {v.btrainNo}</Text>
						<Text> 열차도착정보를 생성한 시각: {v.recptnDt}</Text>
						<Text> 첫번째도착메세지: {v.arvlMsg2}</Text>
						<Text> 두번째도착메세지: {v.arvlMsg3}</Text>
						<Text> 도착코드: {arrivalcode[v.arvlCd]}</Text>
						<Hr/>
					</View>

				)
			}
			</ScrollView>
		</SafeAreaView>
	)
}

const SafeAreaView = styled.SafeAreaView`
	flex: 1;
`;

const ScrollView = styled.ScrollView`
`;

const SearchBar = styled.View`
	border: 1px solid;
`;

const TextInputStyle = {
	width: "90%",
	borderWidth: 1,
	borderRadius: 15,
	marginLeft: 10,
	padding: 7
}

const Hr = styled.View`
	width: 100%;
	height: 3px;
	background-color: #b3b3b3;
`;

const View = styled.View`

`;


export default App;