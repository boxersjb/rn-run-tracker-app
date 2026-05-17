import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/services/supabase";
import { router } from "expo-router";

export default function Addtmp() {

  //Create state manage data from supabase
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [runDate, setRunDate] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  //Function Take Photos
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("ขออนุญาตเข้าถึงกล้องเพื่อถ่ายภาพหน่อยนะคร๊าบบบบบ");
      return;
    }

    //เปิดกล้องเพื่อถ่ายภาพ
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    //หลักจากถ่ายเรียยบร้อยแล้ว เอาไปกับ state ที่เตรียมไว้
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    }
  };

  //Function Upload to Supabase
  const uploadAndSaveData = async () => {
    //Validate UI
    if (!location || !distance || !base64Image) {
      Alert.alert("Alert", "Please Input Data all field");
      return;
    }

    //Upload Photo to Supabase storage and get url image save to supabase
    const fileName = `run_${Date.now()}.jpg`; //file name photo

    // Convert base64 string to Uint8Array
    const base64String = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { data, error } = await supabase.storage
      .from("rn-run-tracker-bk")
      .upload(fileName, bytes, { contentType: "image/jpeg" });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    //Get url and save data to supabase
    let image_url = supabase.storage.from("rn-run-tracker-bk").getPublicUrl(fileName).data.publicUrl; //get url image save to supabase

    //Save data to supabase
    const { error : insertError } = await supabase.from("rn-run-tracker-tb").insert({
      location: location,
      distance: parseFloat(distance),
      time_of_day: timeOfDay,
      run_date: new Date().toISOString().split("T")[0],
      image_url: image_url,
    });

    if (insertError) {
      Alert.alert("Error", insertError.message);
      return;
    }
    //Alert Success and back to home
    Alert.alert("Success", "Data saved successfully");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20 }}>
        {/* ป้อนสถานที่วิ่ง */}
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput placeholder="เช่น สวนลุมพินี" style={styles.inputValue} onChangeText={setLocation} value={location} />

        {/* ป้อนระยะทาง */}
        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          placeholder="เช่น 5.2"
          keyboardType="numeric"
          style={styles.inputValue}
          value={distance}
          onChangeText={setDistance}
        />

        {/* เลือกช่วงเวลา */}
        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity style={[styles.todBtn, { backgroundColor: timeOfDay === "เช้า" ? "#0d7dfa" : "#fff" }]} onPress={() => setTimeOfDay("เช้า")}>
            <Text style={{ fontFamily: "Kanit_400Regular", color: timeOfDay === "เช้า" ? "#ffff" : "#7e7e7e" }}>
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.todBtn, { backgroundColor: timeOfDay === "เย็น" ? "#0d7dfa" : "#fff" }]} onPress={() => setTimeOfDay("เย็น")}>
            <Text style={{ fontFamily: "Kanit_400Regular", color: timeOfDay === "เย็น" ? "#ffff" : "#7e7e7e" }}>
              เย็น
            </Text>
          </TouchableOpacity>
        </View>

        {/* ปุ่มเปิดกล้องถ่ายภาพ */}
        <Text style={styles.titleShow}>รูปภาพสถานที่</Text>
        <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
          {
            imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} />
            ) :
              (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="camera-outline" size={30} color="#b6b6b6" />
                  <Text style={{ fontFamily: "Kanit_400Regular", color: "#b6b6b6" }}>
                    กดเพื่อถ่ายภาพ
                  </Text>
                </View>
              )
          }
        </TouchableOpacity>

        {/* ปุ่มบันทึก */}
        <TouchableOpacity style={styles.saveBtn} onPress={uploadAndSaveData}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>
            บันทึกข้อมูล
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  todBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#e6e6e6",
  },
  saveBtn: {
    padding: 15,
    backgroundColor: "#1889da",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  takePhotoBtn: {
    width: "100%",
    height: 200,
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontFamily: "Kanit_400Regular",
    backgroundColor: "#EFEFEF",
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
  },
});