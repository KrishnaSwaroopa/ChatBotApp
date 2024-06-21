import React from 'react'
import {
    View,Text,StyleSheet
} from "react-native";
import ChatScreen from './ChatScreen'

const ChatBotScreen = ()=>{
    return (
        <View style={styles.container}>
            <ChatScreen/>
       </View>
    )
   
}
export default ChatBotScreen;
const styles = StyleSheet.create({
    container:{
        flex:1,justifyContent:"center",alignItems:"center"
    },
    header:{
        fontSize:12
    }
})