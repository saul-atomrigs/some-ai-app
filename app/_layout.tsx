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

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export default function RootLayout() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

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
      setAnalysisResult(analysisResult);
      console.log('handleAnalyze:', analysisResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>대화 스크린샷을 업로드해주세요</Text>
      <Button
        title='앨범에서 이미지 선택'
        onPress={pickImage}
        color='#4CAF50'
      />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator
          size='large'
          color='#0000ff'
          style={styles.loadingIndicator}
        />
      ) : (
        <Button title='분석하기' onPress={handleAnalyze} color='#FF5722' />
      )}
      {analysisResult && <Text>{analysisResult}</Text>}
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
      const prompt = `다음 대화를 바탕으로, 참여자들 간에 로맨틱한 관심(호감이나 좋아하는 감정)이 있는지 판단하세요. 그렇다면, 그 다음에 이어질 대화를 추천해주세요. 만약 그렇지 않다면, 현재 대화 주제를 파악해서 설명해주세요.\n\대화:\n${extractedText}\n\n응답:`;

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
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginVertical: 30,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
