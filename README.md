Hello, I was having the same problem for Expo running on Android, here what it solved for me:

npm install -g eas-cli
npx expo install expo-dev-client
Then create a eas.json in the root folder:

{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
Then run:

eas build --profile development --platform android

And then just scan de QR Code and you will be fine. I took this from this Medium article from this guy: https://medium.com/@gionata.brunel/implementing-react-native-track-player-with-expo-including-lock-screen-part-2-android-8987e374f965
He wrote one for iOS as well: https://medium.com/@gionata.brunel/implementing-react-native-track-player-with-expo-including-lock-screen-part-1-ios-9552fea5178c#:~:text=All%20you%20need%20to%20do,Native%20Track%20Player%20with%20Expo.

