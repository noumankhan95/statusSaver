import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  PermissionsAndroid,
  ToastAndroid,
  NativeModules,
  Platform,
  Share
} from "react-native";
import { Video } from "expo-av";
import RNFS from "react-native-fs";
import { Ionicons } from "@expo/vector-icons";
import * as ML from "expo-media-library";
import { folderPathCtx } from "../store/infoFolder";
import { useContext } from "react";
import path from "path";
const ShowDetailedItem = (props) => {
  const { item, isVideo } = useRoute().params;
  const { setOptions } = useNavigation();
  const { path } = useContext(folderPathCtx);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const loadVideo = useCallback(async () => {
    try {
      // Load video asynchronously
      const videoPath = `${path}/${item}`;
      const videoExists = await RNFS.exists(videoPath);

      if (videoExists) {
        setVideoLoaded(true);
      } else {
        console.log("Video not found at path:", videoPath);
      }
    } catch (error) {
      console.log("Error loading video:", error);
    }
  }, [path, item]);

  useEffect(() => {

    loadVideo();
  }, [item, path]);
  useEffect(() => {

    setOptions({
      headerRight: () => (
        <>
          <Ionicons
            name="save"
            size={30}
            color="black"
            style={{ marginLeft: 20 }}
            onPress={async () => {
              try {
                await saveToGallery();
              } catch (e) {
                console.log(e);
              }
            }}
          />
          {/* <Ionicons
            name="share-social"
            size={30}
            color="black"
            style={{ marginLeft: 10 }}
            onPress={() => {
              console.log("Pressed");
              shareFile().then(r => console.log(r)).catch(e => console.log(e))
            }}
          /> */}
        </>
      ),
    });
    // if (params.isVideo) console.log(`file://${path}/${item}`, "reload")
  }, [path]);
  // const shareFile = async () => {
  //   try {
  //     const sourcePath = path.join(`${fctx.path}/${params.item}`);
  //     console.log(sourcePath)
  //     const extension = path.extname(sourcePath)
  //     const shareOptions = {
  //       message: "Share File",
  //       title: 'Share File',
  //       url: `file://${fctx.path}/${params.item}`,

  //     };
  //     await Share.share(shareOptions);

  //   } catch (error) {
  //     console.log('Error sharing file:', error);
  //   }
  // };

  const saveToGallery = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("write Permisisons granted");
        const sourcePath = `${path}/${item}`; // Replace with the actual file path
        const filename = sourcePath.split("/").pop(); // Extract the filename from the source path
        await RNFS.mkdir(RNFS.PicturesDirectoryPath + "/WhatsAppStatusSaver");
        const destPath =
          RNFS.PicturesDirectoryPath + "/WhatsAppStatusSaver/" + filename; // Destination path in the gallery directory

        // Check if the file already exists in the gallery
        const fileExists = await RNFS.exists(destPath);
        if (fileExists) {
          ToastAndroid.show(
            "File saved to gallery already!",
            ToastAndroid.SHORT
          );
          return;
        }

        // Move the file to the gallery directory

        await RNFS.copyFile(sourcePath, destPath);
        if (Platform.OS === "android") await RNFS.scanFile(destPath);
        // const asset = await ML.createAssetAsync(`${destPath}`);
        // console.log(asset);
        // await ML.saveToLibraryAsync(`file://${destPath}`);
        ToastAndroid.show(
          "File saved to gallery successfully!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      ToastAndroid.show("Error saving file to gallery", ToastAndroid.SHORT);
      console.log("Error saving file to gallery:", error);
    }
  }, [item, path]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingVertical: 60,
      }}
    >
      {isVideo && videoLoaded ? (
        <Video
          source={{
            uri: `file://${path}/${item}`,
          }}
          style={{ height: "100%", width: "100%" }}
          resizeMode="contain"
          useNativeControls
          shouldPlay
        />
      ) : (
        <Image
          source={{
            uri: `file://${path}/${item}`,
          }}
          style={{ height: "100%", width: "100%", resizeMode: "contain" }}
        />
      )}
    </View>
  );
};

export default ShowDetailedItem;
