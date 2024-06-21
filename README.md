**Introduction**
Recipe Chat App is a React Native application that allows users to get detailed recipes by simply typing or speaking the name of a recipe. The app features a chat screen where users can interact with the app to receive recipe details.

**Features**
. Chat Screen: Interactive chat interface for user input.
. Text Input: Users can type the name of a recipe to get details.
. Audio Input: Users can speak the name of a recipe, and the app will recognize the speech and fetch the recipe.
. API Integration: Calls an external API to retrieve detailed recipes.

**Installation**
To get started with the Recipe Chat App, follow these steps:

# 1. Clone the repository:

git clone https://github.com/KrishnaSwaroopa/ChatBotApp.git
cd ChatBotApp

# 2. Clone the repository:

npm install

# 3. Run the application:

npx react-native run-android # for Android
npx react-native run-ios # for iOS

**Usage**

. Open the app on your device or emulator.
. Navigate to the chat screen.
. Enter a recipe name using the text input or use the audio input feature to speak the recipe name.
. Receive detailed recipe information in the chat interface.

**API Integration**

The app uses an spoonacular API to fetch recipe details. Below is a brief overview of how the API integration works:

# 1.Text Input:

The user types a recipe name.
The app sends a request to the recipe API with the recipe name.
The API responds with detailed recipe information, which is displayed in the chat interface.

# 2. Audio Input:

The user speaks the recipe name.
The app uses a speech-to-text service to convert the audio to text.
The app sends the converted text to the recipe API.
The API responds with detailed recipe information, which is displayed in the chat interface.
