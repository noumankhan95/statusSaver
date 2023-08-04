import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, PermissionsAndroid } from "react-native";
import HomeScreen from "./Screens/HomeScreen";
import FolderPathProvider from "./store/infoFolder";
export default function App() {
  const checkPermissions = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "External Storage Permission",
          message: "This app requires access to your external storage.",
          buttonPositive: "OK",
        }
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Write Storage Permission",
          message:
            "This app requires access to Save Data to your external storage.",
          buttonPositive: "OK",
        }
      );
    } catch (e) {
      console.log("Prrmissions ", e);
    }
  };
  useEffect(() => {
    checkPermissions();
  }, []);
  return (
    <FolderPathProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <HomeScreen />
      </View>
    </FolderPathProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
