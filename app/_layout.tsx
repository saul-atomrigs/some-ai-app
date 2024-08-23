import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useImageAnalyzer from './hooks/useImageAnalyzer';

export default function RootLayout() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { loading, analysisResult, analyzeImage } = useImageAnalyzer();

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
    if (imageUri) {
      await analyzeImage(imageUri);
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
