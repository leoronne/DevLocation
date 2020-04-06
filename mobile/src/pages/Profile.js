import React from "react";

import { WebView } from "react-native-webview";

export default function Profile({ navigation }) {
  const githubUser = navigation.getParam("githubUser");

  return (
    <WebView
      source={{ uri: `https://github.com/${githubUser}` }}
      style={{ flex: 1 }}
    />
  );
}
