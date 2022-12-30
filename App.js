import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, Image } from 'react-native';

import axios from 'axios';
import styled from 'styled-components';
import { API_KEY } from '@env'

const arrivalcode = {
	"0": "진입",
	"1": "도착",
	"2": "출발",
	"3": "전역출발",
	"4": "전역진입",
	"5": "전역도착",
	"99": "운행중"
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

const metroLineColor = {
	"1호선": "#0052A4",
	"2호선": "#00A84D",
	"3호선": "#EF7C1C",
	"4호선": "#00A5DE",
	"5호선": "#996CAC",
	"6호선": "#CD7C2F",
	"7호선": "#747F00",
	"8호선": "#E6186C"
}

const App = () => {

	const [realTimeStationArrival, setRealTimeStationArrival] = useState([]);
	const [searchWord, setsearchWord] = useState("")

	const getRealTimeStationArrival = async (searchWord) => {
		await axios.get(`http://swopenapi.seoul.go.kr/api/subway/${API_KEY}/json/realtimeStationArrival/0/6/${searchWord}`)
			.then((response) => {
				console.log(response.data.realtimeArrivalList)
				const realtimeArrivalList = response.data.realtimeArrivalList;
				const sortedRealtimeArrivalList = realtimeArrivalList.sort((a, b) => {
					if (parseInt(a.subwayId) > parseInt(b.subwayId)) {
						return 1;
					} else {
						return -1;
					}
				})
				setRealTimeStationArrival(sortedRealtimeArrivalList)
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

	return (
		<SafeAreaView>
			<SearchBar>
				<TextInput
					style={TextInputStyle}
					placeholder={"역 명을 입력하세요."}
					onChangeText={setsearchWord}
					onSubmitEditing={() => getRealTimeStationArrival(searchWord)}
				/>
				<RefreshBtn
					onPress = {() => getRealTimeStationArrival(searchWord)}
				>
					<Image
						source={require('../whereabouts/Assets/refreshIcon.png')}
						style={{ width: 35, height: 35 }}
					/>
				</RefreshBtn>

			</SearchBar>
			<ScrollView>
				<RealTimeStationArrivalView>
					{
						realTimeStationArrival.map((v, i) =>
							<View key={i}>
								<Text
									style={{ color: metroLineColor[metroLine[v.subwayId]] }}
								>
									{metroLine[v.subwayId]} {v.updnLine}
								</Text>
								<Text>
									{v.trainLineNm} {v.btrainNo}
								</Text>
								{
									(v.barvlDt !== "0") ? (<Text> 열차도착예정시간: {expectedArrivalTime(v.barvlDt)}</Text>) : (<></>)
								}
								<Text> 첫번째도착메세지: {v.arvlMsg2}</Text>
								<Text> 두번째도착메세지: {v.arvlMsg3}</Text>
								<Text> 도착코드: {arrivalcode[v.arvlCd]}</Text>
							</View>
						)
					}
				</RealTimeStationArrivalView>
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
	flex-direction: row;
	align-items: center;
`;

const TextInputStyle = {
	width: "85%",
	height: 35,
	borderWidth: 1,
	borderRadius: 15,
	marginLeft: 10,
	padding: 7
}

const RefreshBtn = styled.TouchableOpacity`
	position: absolute;
	right: 10px;
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

const View = styled.View`
	margin-top: 10px;
	border: 1px solid;
	border-radius: 15px;
	padding: 5px;
	width: 95%;
`;

export default App;