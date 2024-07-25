import React, { useState } from 'react';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { Image, useTheme } from "tamagui";
import { Modal, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useMqtt } from "@/context/MqttContext";
import { envConfig } from "@/config";
import { useTranslation } from "react-i18next"
import i18next from "../../../../i18n/i18n.config"
import AsyncStorage from "@react-native-async-storage/async-storage"
export const unstable_settings = {
  initialRouteName: "index",
};

const Layout = () => {
  const theme = useTheme();
  const { subscribeToTopics } = useMqtt();
  const { t } = useTranslation()
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Open and close modal functions
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const hiLang = async () => {
    await AsyncStorage.setItem("lng", "hi")
    i18next.changeLanguage("hi")
    closeModal();
  };
  const enLang = async() => {
    await AsyncStorage.setItem("lng", "en")
    i18next.changeLanguage("en")
    closeModal();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={openModal}>
                <Text style={styles.buttonText}>{t('Change language')}
                  
                </Text>
                
              </TouchableOpacity>
              <Image
                source={{
                  uri: "./logo.png",
                  height: 75,
                  width: 75,
                }}
              />
            </View>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerLeft: () => <DrawerToggleButton tintColor="#fff" />,
            headerStyle: {
              backgroundColor: theme.green10.get(),
            },
          }}
        />
      </Stack>

      {/* Modal component */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{t('Change language')}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.lanButton]} onPress={hiLang}>
                <Text style={styles.buttonText}>{t('Hindi') }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.lanButton]} onPress={enLang}>
                <Text style={styles.buttonText}>{t('English')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight : -90
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  lanButton: {
    backgroundColor: '#4CAF50',
  },
});

export default Layout;
