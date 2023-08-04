import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNFS from "react-native-fs";
import { Video } from "expo-av";
import { folderPathCtx } from "../store/infoFolder";
import * as VideoThumbnails from 'expo-video-thumbnails';
const ListItem = React.memo(
  ({ item, isVideo }) => {
    const { navigate, setOptions } = useNavigation();
    const { path } = useContext(folderPathCtx);
    const [thumbnail, setthumbnail] = useState("")

    const generateThumbnail = useCallback(async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          `file://${path}/${item}`,
          {
            time: 15000,
          }
        );
        setthumbnail(uri);
      } catch (e) {
        console.log(e);
      }
    }, [path, item]);
    useEffect(() => {
      if (isVideo) { generateThumbnail(); }

    }, []);
    return (
      <TouchableOpacity
        style={{
          width: "48%",
          height: 200,
          margin: 4,
        }}
        onPress={() => {
          navigate("Item Detail", { item: item, isVideo: isVideo });
        }}
      >
        {isVideo && thumbnail ? (
          <Image
            source={{
              uri: thumbnail,
            }}
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <Image
            source={{
              uri: `file://${path}/${item}`,
            }}
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    return prev.item === next.item;
  }
);

export default React.memo(ListItem);
