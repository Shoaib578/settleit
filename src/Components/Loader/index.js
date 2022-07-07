import React from "react";
import { View, Image, Text, ActivityIndicator } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "./style";

const CustomIndicator = () => (
  <View style={styles.container}>
    <ActivityIndicator size={"large"} color={'#ffffff'} />
    <Text
      style={{
        fontSize: 14,
        color: "#ffffff",
      }}
    >
      Please Wait...
    </Text>
  </View>
);

const Loader = ({loading}) => {
  return (
    <Spinner visible={loading}>
      <CustomIndicator />
    </Spinner>
  );
};

export default Loader;