import React, { useState } from 'react';
import {
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import OpenAI from 'openai';
import { Config } from 'react-native-config';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export default function RootLayout() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('pickImage:', result);

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;

    setLoading(true);
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const analysisResult = await analyzeImage(base64Image);
      console.log('handleAnalyze:', analysisResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a conversation screenshot</Text>
      <Button title='Pick an image from camera roll' onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <Button title='Analyze' onPress={handleAnalyze} />
      )}
    </View>
  );
}

const analyzeImage = async (base64Image: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please extract the text from this image.' },
            {
              type: 'image_url',
              image_url: {
                url: 'data:image/jpeg;base64,' + base64Image,
                detail: 'low',
              },
            },
          ],
        },
      ],
    });

    const extractedText = response.choices[0]?.message?.content || '';

    if (extractedText) {
      const prompt = `Given the following conversation, determine if there is a romantic interest (a "crush" or "like" situation) between the participants. If there is, provide a response indicating that. If not, provide a response indicating otherwise.\n\nConversation:\n${extractedText}\n\nResponse:`;

      const analysisResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: prompt }],
          },
        ],
      });

      return (
        analysisResponse.choices[0]?.message?.content ||
        'No analysis result available.'
      );
    } else {
      return 'Failed to extract text from image.';
    }
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    return 'Failed to analyze image.';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
