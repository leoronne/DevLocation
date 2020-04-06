import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/socket";

import styles from '../assets/css/Main.js';

export default function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState("");

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();
    const { latitude, longitude } = currentRegion;
    connect(latitude, longitude, techs);
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get("dev/index"
      , {
        params: {
          latitude,
          longitude,
          techs: techs.trim()=== '' ? null : techs
      }
    }
    );
  setDevs(response.data);
  setupWebsocket();
}

function handleRegionChanged(region) {
  setCurrentRegion(region);
}

if (!currentRegion) {
  return null;
}

return (
  <>
    <MapView
      onRegionChangeComplete={handleRegionChanged}
      initialRegion={currentRegion}
      style={styles.map}
    >
      {devs.map(dev => (
        <Marker
          key={dev._id}
          coordinate={{
            latitude: dev.location.coordinates[1],
            longitude: dev.location.coordinates[0]
          }}
        >
          <Image
            style={styles.avatar}
            source={{
              uri: dev.avatar_url
            }}
          />

          <Callout
            onPress={() => {
              navigation.navigate("Profile", {
                githubUser: dev.githubUser
              });
            }}
          >
            <View style={styles.callout}>
              <Text style={styles.devName}>{dev.name}</Text>
              <Text style={styles.devBio}>{dev.bio}</Text>
              <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>

    <View style={styles.searchForm}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar devs por techs..."
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={techs}
        onChangeText={setTechs} // or text => setTechs(text)
      />
      <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
        <MaterialIcons name="my-location" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </>
);
}

