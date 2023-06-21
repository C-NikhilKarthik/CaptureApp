import React, { useEffect, useState } from "react";
import { StyleSheet,View, Text, Image, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import { Camera } from "expo-camera";
import * as Battery from "expo-battery";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
// import firebase from 'firebase/app';
// import 'firebase/firestore';

import { firebase }  from "./firebaseConfig";

// Get a reference to the Firestore instance

const App = () => {
  const [internetStatus, setInternetStatus] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState(null);
  const [batteryPercentage, setBatteryPercentage] = useState(null);
  const [location, setLocation] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    // Check internet connectivity status
    const unsubscribe = NetInfo.addEventListener((state) => {
      setInternetStatus(state.isConnected ? "Connected" : "Disconnected");
    });

    // Get battery status and percentage
    const getBatteryStatus = async () => {
      const status = await Battery.getBatteryStateAsync();
      setBatteryStatus(
        status === Battery.BatteryState.CHARGING ? "Charging" : "Discharging"
      );
      const percentage = await Battery.getBatteryLevelAsync();
      setBatteryPercentage(percentage * 100);
    };
    getBatteryStatus();

    // Get location
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setLocation(location.coords);
      } else {
        console.log("Location permission denied");
      }
    };
    getLocation();

    // Capture photo every 15 minutes
    const captureAndUploadPhoto = async () => {
      try {
        const { status } = await Camera.requestPermissionsAsync();
        if (status === "granted") {
          const photo = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            base64: false,
          });
          console.log("Captured photo:", photo.assets[0].uri);
    
          // Upload the photo to Firestore
          await uploadPhotoToFirestore(photo.assets[0].uri);
        } else {
          console.log("Camera permission denied");
        }
      } catch (error) {
        console.error('Error capturing and uploading photo:', error);
      }
    };
    
    const uploadPhotoToFirestore = async (photoURI) => {
      try {
        // Convert the photo to Blob format
        const response = await fetch(photoURI);
        const blob = await response.blob();
    
        // Create a unique filename for the photo
        const fileName = `photo_${Date.now()}.jpg`;
        console.log("Here 0")

        // Create a reference to the Firestore collection and document
        const collectionRef = firebase.storage().ref().child(fileName).put(blob);
        console.log("Here 1");
        await collectionRef;
        console.log("Here 2");

        // Upload the photo to Firestore

        
        console.log('Photo uploaded to Firestore successfully!');
      } catch (error) {
        console.error('Error uploading photo to Firestore:', error);
      }
    };
    
    // Usage:
    // Call the captureAndUploadPhoto function
    captureAndUploadPhoto();
    const photoCaptureInterval = setInterval(captureAndUploadPhoto, 900000); // 15 minutes in milliseconds

    // Update timestamp every 15 minutes
    const updateTimestamp = () => {
      const currentTime = new Date().toLocaleString();
      setTimestamp(currentTime);
    };
    updateTimestamp();
    const timestampUpdateInterval = setInterval(updateTimestamp, 900000); // 15 minutes in milliseconds

    return () => {
      unsubscribe();
      clearInterval(photoCaptureInterval);
      clearInterval(timestampUpdateInterval);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <View style={[styles.View]}>
        <Text>Internet Status: {internetStatus}</Text>
        <Text>Battery Status: {batteryStatus}</Text>
        <Text>Battery Percentage: {batteryPercentage}%</Text>
        {location && (
          <Text>
            Location: {location.latitude}, {location.longitude}
          </Text>
        )}
        <Text>Timestamp: {timestamp}</Text>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  View:{
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

})

export default App;
