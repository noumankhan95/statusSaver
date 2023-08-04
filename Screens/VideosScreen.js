import { useCallback, useEffect, useState } from "react";
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
import { useContext } from "react";
import { folderPathCtx } from "../store/infoFolder";
import path from "path";
const VideosScreen = () => {
  const [videos, setvideos] = useState();
  const { path: VideosPath } = useContext(folderPathCtx);

  const listFilesInStatusesFolder = useCallback(async () => {
    try {

      if (PermissionsAndroid.RESULTS.GRANTED) {
        if (!VideosPath) return;
        // console.log("Videos Path", VideosPath);

        const files = await RNFS.readdir(path.join(VideosPath));

        const filteredFiles = files.filter((file) => {
          const lowerCaseFile = file.toLowerCase();
          return (
            lowerCaseFile.endsWith(".mp4") || lowerCaseFile.endsWith(".m4a")
          );
        });
        // console.log("Videos Filtered", filteredFiles);
        setvideos((p) => filteredFiles);
      } else {
        console.log("External storage permission denied.");
      }
    } catch (error) {
      console.log("Error reading .Statuses folder for Videos:", error);
    }
  }, [VideosPath]);
  useEffect(() => {
    listFilesInStatusesFolder();
  }, [VideosPath]);
  return (
    <FlatList
      style={{ flex: 1, width: "100%", padding: 5 }}
      data={videos}
      keyExtractor={(item) => item}
      numColumns={2}
      renderItem={({ item }) => <ListItem item={item} isVideo={true} />}
    />
  );
};

export default VideosScreen;
