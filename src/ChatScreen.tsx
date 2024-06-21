import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';

const windowWidth = Dimensions.get('window').width;

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', content: string }[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [reciepedata, setreciepedata] = useState<{ title: string, image: string }[]>([]);
  const [reseipedesc, setreceipedesc] = useState<any>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const[error,seterror] = useState('')
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    console.log("onSpeechResults",e)
    const text = e.value[0];
    seterror('')
    handleVoiceInput(text);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-IN');
    } catch (e) {
      console.error(e);
    }
  };
  const onSpeechError = (e: any) => {
    console.log('onSpeechError: ', e);
    if(e.error){
      var errmsg = error.split('/')
      seterror(errmsg[1])
    }
    
  };
  const handleVoiceInput = (text: string) => {
    if (!text.trim()) return;

    const newUserMessage = { sender: 'user', content: text };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    setTimeout(() => {
      getRecipeFor(text);
    }, 1000);
  };

  const handleSend = () => {
    seterror('')
    if (!inputText.trim()) return;

    const newUserMessage = { sender: 'user', content: inputText };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText('');

    setTimeout(() => {
      getRecipeFor(inputText);
    }, 1000);
  };

  const getRecipeFor = (foodName: string) => {
    fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${foodName.toLowerCase()}&apiKey=e1e47f65f5604fbe9bb3a10d58bbebba`
    )
      .then(response => response.json())
      .then(data => {
        setreciepedata(data.results[0]);
        if (data.results[0]) {
          fetch(
            `https://api.spoonacular.com/recipes/${data.results[0].id}/information?apiKey=e1e47f65f5604fbe9bb3a10d58bbebba`
          )
            .then(response => response.json())
            .then(receipedetails => {
              setreceipedesc(receipedetails);
              const response = `Title: ${receipedetails.title}\nIngredients Needed: ${receipedetails.extendedIngredients.map((ingredient: any) => ingredient.name).join(', ')}\nInstructions: ${receipedetails.analyzedInstructions.map((instruction: any) => instruction.steps.map((res: any) => res.step).join('\n')).join('\n')}`;
              const newBotMessage = { sender: 'bot', content: response };
              setMessages((prevMessages) => [...prevMessages, newBotMessage]);
              scrollViewRef.current?.scrollToEnd({ animated: true });
            })
            .catch(() => {
              console.log("error");
            });
        }
      })
      .catch(() => {
        console.log("error");
      });
  };

  const handleSaveRecipe = async (recipe: string) => {
    try {
      await AsyncStorage.setItem('savedRecipe', recipe);
      Alert.alert('Recipe Saved', 'The recipe has been saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageContainer, message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer]}>
            {message.sender === 'user' ? 
              <View style={[styles.messageBubble, message.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble]}>
                <Text style={styles.messageText}>{message.content}</Text>
              </View> : 
              <View style={[styles.messageBubble, styles.botMessageBubble]}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Title : {reciepedata?.title}</Text>
                <Image source={{ uri: reciepedata?.image }} style={{ width: 200, height: 100, paddingVertical: 10 }} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Ingredients Needed : </Text>
                {reseipedesc?.extendedIngredients?.map((ingredient: any, index: number) =>
                  <Text key={index}>
                    {ingredient.name}
                  </Text>
                )} 
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Instructions : </Text>
                {reseipedesc?.analyzedInstructions?.map((instruction: any) =>
                  instruction?.steps?.map((res: any, i: number) =>
                    <Text key={i}>{i + 1}. <Text>{res.step}</Text></Text>
                  )
                )} 
              </View>
            }
            {message.sender === 'bot' && (
              <TouchableOpacity
                style={styles.recipeButton}
                onPress={() => handleSaveRecipe(message.content)}
              >
                <Text style={styles.recipeButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <Text style={{textAlign:"center"}}>{error.split('/')}</Text>
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.textInput}
          placeholder="Type a food name..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.voiceButton} onPress={startRecognizing}>
          <Text style={styles.voiceButtonText}>🎤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 32,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  userMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcaba7',
  },
  botMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgrey',
  },
  messageText: {
    fontSize: 16,
  },
  recipeButton: {
    backgroundColor: '#dcaba7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  recipeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: windowWidth,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#dcaba7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceButton: {
    backgroundColor: '#dcaba7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
