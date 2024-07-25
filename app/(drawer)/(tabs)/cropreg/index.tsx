import React, { useState, useEffect } from "react"
import { useMemo } from "react"
import type { SelectProps } from "tamagui"
import { Adapt, Sheet } from "tamagui"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTranslation } from "react-i18next"
import {
  Card,
  XStack,
  YStack,
  useTheme,
  Button,
  Input,
  H1,
  Select,
  Spinner,
} from "tamagui"

export default function Page() {
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const { t } = useTranslation()
  const [crop, setCrop] = useState("")
  const handlePress = async () => {
    try {
      setLoading(true)
      await AsyncStorage.setItem("cropName", crop)
      console.log("crop updated")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      backgroundColor={theme.gray5.get()}
      size="$4"
      bordered
      borderColor={theme.gray7.get()}
      scale={0.95}>
      <Card.Header padded>
        <H1 textAlign="center">{t("Crop Registration")}</H1>
      </Card.Header>
      <YStack alignItems="center" gap="$2" justifyContent="center" padding="$2">
        <Input
          placeholder={t("Crop Name")}
          width="$20"
          backgroundColor={"white"}
          onChangeText={(e) => setCrop(e)}
        />
        <Input
          placeholder={t("Location")}
          width="$20"
          backgroundColor={"white"}
        />
        <XStack width="$20" gap="$2">
          <Input
            placeholder={t("Area")}
            width={"60%"}
            backgroundColor={"white"}
          />
          <SelectDemoItem id="select-demo-1" />
        </XStack>
        <Input
          placeholder={t("Soil Type")}
          width="$20"
          backgroundColor={"white"}
        />

        <Button
          style={{
            backgroundColor: theme.green10.get(),
            color: "white",
            justifyContent: "center",
            width: "$20",
          }}
          onPress={handlePress}>
          {loading ? (
            <Spinner size="large" color="$white025" marginRight="$3" />
          ) : (
            t("Register")
          )}
        </Button>
      </YStack>
      <Card.Footer padded></Card.Footer>
    </Card>
  )
}
export function SelectDemoItem(props: SelectProps) {
  const { t, i18n } = useTranslation()
  const [val, setVal] = useState("Square Feet")

  const items = [
    { name: t("Square Feet") },
    { name: t("Square meter") },
    { name: t("hectare") },
  ]
  const theme = useTheme()
  return (
    <Select
      value={t(val)}
      onValueChange={setVal}
      disablePreventBodyScroll
      {...props}>
      <Select.Trigger width="$10" backgroundColor={"white"}>
        <Select.Value placeholder="Something" color={theme.green10.get()} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: "spring",
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport minWidth={"200"}>
          <Select.Group>
            <Select.Label>{t("Units")}</Select.Label>
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}>
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto"></Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [items]
            )}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  )
}
