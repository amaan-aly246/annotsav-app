import { Button, Card, H2, H3, Image, XStack, YStack, H6, Text } from "tamagui"
import ProgressBar from "./ProgressBar"
import CropTable from "./CropTable"
import { useCallback, useEffect, useState } from "react"
import { useMqtt } from "@/context/MqttContext"
import { Feather } from "@expo/vector-icons"
import { envConfig } from "@/config"
import { useTranslation } from "react-i18next"
import AsyncStorage from "@react-native-async-storage/async-storage"
let dateLastTopicRecived = ""
let timeLastTopicRecived = ""

const CropStatus = () => {
  const [val, setVal] = useState(0)
  const { t } = useTranslation()
  const { mqttClient, mqttData, mqttError, subscribeToTopics, publishToTopic } =
    useMqtt()

  const lastTopicRecived = (topic: string | null | undefined) => 
    {
    if (topic) {
      dateLastTopicRecived = new Date().toLocaleDateString("en-IN")
      timeLastTopicRecived = new Date().toLocaleTimeString("en-IN")
    }
    return `${dateLastTopicRecived} at ${timeLastTopicRecived}`
  }

  useEffect(() => 
    {
    const initialize = async () => {
      console.log("Subscribing to topics")
      subscribeToTopics(["pv0/moisture"], { qos: 2 })

      // Wait a bit to ensure the subscription is active
      setTimeout(() => {
        console.log("Initial MOISTURE_GET command")
        publishToTopic("pv0/commands", "MOISTURE_GET", { qos: 2 })
        setVal(-1)
      }, 1000)
    }

    if (mqttClient) {
      initialize()
    }
  }, [mqttClient])

  const handleRefresh = useCallback(() => {
    console.log("Sending MOISTURE_GET command")
    publishToTopic("pv0/commands", "MOISTURE_GET", { qos: 2 })
  }, [publishToTopic])

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [handleRefresh])

  useEffect(() => {
    if (mqttData) {
      console.log(
        `MQTT Data Received: ${mqttData.message} on topic ${mqttData.topic}`
      )
    } else {
      console.log("No MQTT Data")
    }

    if (mqttData?.topic === "pv0/moisture" && mqttData?.message) {
      console.log("Updating moisture value")
      setVal(parseInt(mqttData.message))
    }
  }, [mqttData])

  const [cropName, setCropName] = useState("")
  useEffect(() => {
    const saveData = async () => {
      const crop = await AsyncStorage.getItem("cropName")
      if (crop) {
        setCropName(crop)
      }
    }
    saveData();
  }, [])

  return (
    <Card bordered scale={0.95}>
      <Card.Header padded>
        <XStack alignItems="center" justifyContent="space-between">
          <H2>
            {t("Crop Status")}: {cropName}
          </H2>

          <Button borderRadius="$12" onPress={handleRefresh}>
            <Feather name="refresh-cw" size={24} color="black" />
          </Button>
        </XStack>

        <YStack width="100%" paddingTop="$3" gap="$2">
          <H3 height={30} paddingLeft="$1" opacity={0.5}>
            {t("Moisture Level")}: {val}%
          </H3>
          <Text>
            {t("Last Updated")}: {lastTopicRecived(mqttData?.topic)}
          </Text>
          <ProgressBar val={val} />
        </YStack>
      </Card.Header>
      <CropTable />
    </Card>
  )
}

export default CropStatus
