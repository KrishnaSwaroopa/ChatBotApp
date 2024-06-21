import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatBotScreen from './ChatBotScreen'
import { Image } from 'react-native';
type screenType = {
    Chat : undefined
}
const  Tab = createBottomTabNavigator<screenType>()
export default function BottomTabs (){
    return(
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle:{fontSize:15,color:"#dcaba7"},
            headerShown: false
        }}>
        <Tab.Screen name="Chat" component={ChatBotScreen}
        options={{
            headerShown: false,
            tabBarLabel: 'Chat',
          
            tabBarIcon: () => (
                <Image source={require('../images/chaticon.png')} style={{height:25,width:25,tintColor:"#dcaba7"}}/>
             )
            
           
          }}/>
      </Tab.Navigator>
    )
}