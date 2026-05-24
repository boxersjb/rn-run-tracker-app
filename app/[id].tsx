import { ScrollView, StyleSheet, Text, View, Image, Alert, TextInput, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function RunDetail() {
  // collect id from params
  const { id } = useLocalSearchParams();

  // Create state colleges data from supabase and apply to component screen
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [imageUri, setImageUri] = useState("");

  // Pull data from supabase from id
  useEffect(() => {
    // Fetch data from supabase and set to state runs
    const fetchRunsDeail = async () => {
      const { data, error } = await supabase
        .from('rn-run-tracker-tb')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        Alert.alert('Error', error.message);
        return;
      } else {
        setLocation(data.location);
        setDistance(data.distance.toString());
        setTimeOfDay(data.time_of_day);
        setImageUri(data.image_url);
      }
    }

    fetchRunsDeail();
  }, [])

  //Handle update data from supabase
  const handleUpdateRun = async () => {
    //Validate UI
    if (!location || !distance) {
      Alert.alert("Alert", "Please Input Data all field");
      return;
    }
    const { error } = await supabase
      .from('rn-run-tracker-tb')
      .update({ location, distance, time_of_day: timeOfDay })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert("Success", "Update Success");
    router.back();
  }

  //Handle delete data from supabase
  const handleDeleteRun = async () => {
    Alert.alert(
      "Alert",
      "Are you sure you want to delete this run?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error: error } = await supabase.from("rn-run-tracker-tb").delete().eq("id", id);

            if (error) {
              Alert.alert("Alert", error.message);
              return;
            }

            // Delete image from Supabase
            const { error: deleteImageError } = await supabase.storage.from("rn-run-tracker-bk").remove([imageUri.split("/").pop() || ""]);

            if (deleteImageError) {
              Alert.alert("Alert", deleteImageError.message);
              return;
            }

            Alert.alert("Alert", "Delete Success");
            router.back();
          },
        },
      ],
    );
  };


  return (
    <ScrollView>
      {/* Image Section */}
      <Image source={{ uri: imageUri }} style={styles.imgRun} resizeMode='cover' />

      {/* Edit Section */}
      <View style={styles.card}>
        {/* Input Location */}
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput placeholder="เช่น สวนลุมพินี" style={styles.inputValue} onChangeText={setLocation} value={location} />

        {/* Input Distance */}
        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          placeholder="เช่น 5.2"
          keyboardType="numeric"
          style={styles.inputValue}
          value={distance}
          onChangeText={setDistance}
        />

        {/* Input Time */}
        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity style={[styles.todBtn, { backgroundColor: timeOfDay === "เช้า" ? "#0d7dfa" : "#e6e6e6" }]} onPress={() => setTimeOfDay("เช้า")}>
            <Text style={{ fontFamily: "Kanit_400Regular", color: timeOfDay === "เช้า" ? "#ffff" : "#7e7e7e" }}>
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.todBtn, { backgroundColor: timeOfDay === "เย็น" ? "#0d7dfa" : "#e6e6e6" }]} onPress={() => setTimeOfDay("เย็น")}>
            <Text style={{ fontFamily: "Kanit_400Regular", color: timeOfDay === "เย็น" ? "#ffff" : "#7e7e7e" }}>
              เย็น
            </Text>
          </TouchableOpacity>
        </View>
        {/* button save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateRun}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>บันทึกการแก้ไข</Text>
        </TouchableOpacity>
        {/* button delete */}
        <TouchableOpacity style={styles.dataDel} onPress={handleDeleteRun}>
          <Ionicons name="trash-bin-sharp" size={18} color="#ff0000" />
          <Text style={{ fontFamily: "Kanit_400Regular", color: "#ff0000" }}>ลบรายการนี้</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  dataDel: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  saveBtn: {
    padding: 15,
    backgroundColor: "#1980f5",
    borderRadius: 8,
    alignItems: "center",
  },
  todBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#e6e6e6",
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
  card: {
    top: -10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 25,
    height: '100%',
  },
  container: {
    flex: 1,
  },
  imgRun: {
    width: '100%',
    height: 250,
  },
})