import { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  ScrollView,
  FlatList,
} from "react-native";
import RNFS from "react-native-fs";
import ListItem from "../Component/ListItem";
import { useNavigation } from "@react-navigation/native";
import { folderPathCtx } from "../store/infoFolder";
import path from "path";
const ImagesScreen = () => {
  const [images, setimages] = useState();
  const { path: imagesPath } = useContext(folderPathCtx);
  const listFilesInStatusesFolder = useCallback(async () => {
    try {
      if (PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("Images Path", imagesPath);
        if (!imagesPath) return;
        const files = await RNFS.readdir(path.join(imagesPath));
        const filteredFiles = files.filter((file) => {
          const lowerCaseFile = file.toLowerCase();
          return (
            lowerCaseFile.endsWith(".jpeg") ||
            lowerCaseFile.endsWith(".jpg") ||
            lowerCaseFile.endsWith(".png")
          );
        });
        setimages((p) => filteredFiles);
      } else {
        console.log("External storage permission denied.");
      }
    } catch (error) {
      console.log("Error reading .Statuses folder for Images:", error);
    }
  }, [imagesPath]);
  useEffect(() => {
    listFilesInStatusesFolder();
  }, [imagesPath]);
  return (
    <FlatList
      style={{ flex: 1, width: "100%", padding: 5 }}
      data={images}
      keyExtractor={(item) => item}
      numColumns={2}
      renderItem={({ item }) => <ListItem item={item} />}
    />
  );
};

export default ImagesScreen;
