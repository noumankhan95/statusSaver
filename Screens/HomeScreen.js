import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import ImagesScreen from "./ImagesScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ShowDetailedItem from "../Component/ShowDetailedItem";
import VideosScreen from "./VideosScreen";
import * as RNFS from "react-native-fs";
import { useContext } from "react";
import { folderPathCtx } from "../store/infoFolder";
import path from "path";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createNativeStackNavigator();
const TopNavigator = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const fctx = useContext(folderPathCtx);
  const [isloading, setisloading] = useState(false);
  // useEffect(() => { AsyncStorage.removeItem("statusPath") }, [])
  useEffect(() => {
    setisloading(p => true)
    AsyncStorage.getItem("statusPath").then(p => {
      console.log("p", p)
      if (p) {
        console.log("path exists")
        return fctx.setPath(p);
      } else {
        console.log("path not exists")

        findWhatsAppFolder().then(path => {
          if (path) {
            AsyncStorage.setItem("statusPath", path).then(r => { console.log("Set item", r) }).catch(e => console.log(e))

            console.log("spath", path)
            fctx.setPath(path);
          }
        }).catch(e => console.log(e))
      }

    }
    ).catch(e => console.log("error async path")).finally(f => setisloading(p => false))
  }, []);
  const findWhatsAppFolder = useCallback(async () => {
    try {
      const externalStoragePath = RNFS.ExternalStorageDirectoryPath;
      const androidDataPath = path.join(externalStoragePath, "Android", "data");

      const resultExternal = await searchForWhatsAppFolder(externalStoragePath);
      if (resultExternal) {
        console.log("result External", resultExternal)
        return resultExternal.toString();
      }

      const resultAndroidData = await searchForWhatsAppFolder(androidDataPath);
      if (resultAndroidData) {

        console.log("result android", resultAndroidData)

        return resultAndroidData;
      }

      return null;
    } catch (error) {
      console.log("Error while searching for WhatsApp folder:", error.message);
      return null;
    }
  }, []);
  const searchForWhatsAppFolder = useCallback(
    async (startDir) => {
      try {
        const files = await RNFS.readdir(startDir);
        for (const file of files) {
          const filePath = path.join(startDir, file);
          const stat = await RNFS.stat(filePath);

          // Check if the current directory is the WhatsApp folder
          if (
            stat.isDirectory() &&
            (file === "WhatsApp" || file === "whatsapp")
          ) {
            const statusesFolderPath = path.join(
              filePath,
              "Media",
              ".Statuses"
            );
            if (!RNFS.exists(statusesFolderPath)) return;
            const statusesFolderStat = await RNFS.stat(statusesFolderPath);
            if (statusesFolderStat.isDirectory()) {
              // Found the .Statuses folder
              console.log(".Statuses folder found:", statusesFolderPath);
              return statusesFolderPath; // You can return the path or do further operations here
            }
          }
        }
      } catch (error) {
        console.log(
          "Error while searching for WhatsApp folder:",
          error.message
        );
      }
      return null; // WhatsApp folder not found in this path
    },
    [isloading]
  );
  if (isloading)
    <View style={styles.container}>
      <ActivityIndicator size={60} color="orange" />
    </View>;
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="WhatsApp Status Saver"
            component={TopNavigation}
          />
          <Stack.Screen name="Item Detail" component={ShowDetailedItem} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const TopNavigation = () => {
  return (
    <TopNavigator.Navigator>
      <TopNavigator.Screen name="Images" component={ImagesScreen} />
      <TopNavigator.Screen name="Videos" component={VideosScreen} />
    </TopNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
