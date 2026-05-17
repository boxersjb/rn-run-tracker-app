import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View, Image, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {

  //delay 3 seconds before navigating to the Home screens
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      //Image Logo
      <Image
        source={require("../assets/images/runner.png")}
        style={styles.imglogo}
      />

      //Text Logo
      <Text style={styles.txtHeader}>Run Tracker</Text>
      <Text style={styles.txtSub}>วิ่งเพื่อสุขภาพ</Text>

      //circular progress bar
      <ActivityIndicator
        size="large"
        color="#555555"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imglogo: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  txtHeader: {
    fontSize: 30,
    color: "#555555",
    fontFamily: "Kanit_400Regular",
  },
  txtSub: {
    fontSize: 20,
    color: "#555555",
    fontFamily: "Kanit_400Regular",
  }
});