import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useImageAnalyzer from './hooks/useImageAnalyzer';

export default function RootLayout() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { loading, analysisResult, analyzeImage, setAnalysisResult } =
    useImageAnalyzer();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log('pickImage:', result);

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      setAnalysisResult(null); // Clear previous result when a new image is selected
    }
  };

  const handleAnalyze = async () => {
    if (imageUri) {
      await analyzeImage(imageUri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.placeholderContainer}
          onPress={pickImage}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>
              대화 스크린샷을 업로드해주세요
            </Text>
          )}
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size='large'
            color='#0000ff'
            style={styles.loadingIndicator}
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              { backgroundColor: imageUri ? '#FF5722' : '#ccc' },
            ]}
            onPress={handleAnalyze}
            disabled={!imageUri} // Disable the button when no image is selected
          >
            <Text style={styles.analyzeButtonText}>분석하기</Text>
          </TouchableOpacity>
        )}

        {analysisResult && (
          <View style={styles.analysisResultContainer}>
            <Text style={styles.analysisResultText}>{analysisResult}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderContainer: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  analyzeButton: {
    width: '90%',
    paddingVertical: 15,
    borderRadius: 8,
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  analysisResultContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
  },
  analysisResultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
