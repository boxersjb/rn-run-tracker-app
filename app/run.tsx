import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { supabase } from '@/services/supabase';
import { Runs } from '@/types';
import Icon from '@expo/vector-icons/MaterialIcons';
import { FontAwesome6 } from '@expo/vector-icons';


export default function Run() {
  const [runs, setRuns] = useState<Runs[]>([]);

  const fetchRuns = async () => {
    const { data, error } = await supabase
      .from('rn-run-tracker-tb')
      .select('*')
      .order('run_date', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setRuns(data as Runs[]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRuns();
    }, [])
  );

  const formatThaiDate = (dateStr: string) => {
    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.toLocaleString('th-TH', { month: 'long' });
    const year = date.getFullYear() + 543;

    return `${day} ${month} พ.ศ. ${year}`;
  };

  const renderItem = ({ item }: { item: Runs }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: "/[id]",
        params: {
          id: item.id,
          location: item.location,
          distance: String(item.distance),
          timeOfDay: item.time_of_day,
        },
      })
      }
    >

      <View style={styles.leftSection}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.location}</Text>
          <Text style={styles.date}>
            {formatThaiDate(item.run_date)}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.distance}>{item.distance} km</Text>
        <Icon name="chevron-right" size={20} color="#ccc" />
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <FlatList data={runs} keyExtractor={(item) => item.id} renderItem={renderItem} />
        //section add run button
      <TouchableOpacity style={styles.btnAdd}>
        <FontAwesome6 name="add" size={30} color='#fff' onPress={() => router.push("/add")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAdd: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0d7dfa',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12
  },

  textContainer: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Kanit_700Bold',
    color: '#333'
  },

  date: {
    marginTop: 4,
    fontSize: 13,
    color: '#999',
    fontFamily: 'Kanit_400Regular'
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  distance: {
    fontSize: 15,
    color: '#1e88e5',
    fontWeight: 'bold',
    marginRight: 6,
  },

  arrow: {
    fontSize: 22,
    color: '#b0bec5',
    lineHeight: 22,
  },
});