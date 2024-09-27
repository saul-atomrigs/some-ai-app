import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import useImageAnalyzer from '@/hooks/useImageAnalyzer';
import { ImagePickerView, AnalysisResultView, AnalyzeButton } from '@/components';
import { colors, size, spacing } from '@/design-tokens';

export default function RootLayout() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { loading, analysisResult, analyzeImage, setAnalysisResult } = useImageAnalyzer();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (imageUri) {
      await analyzeImage(imageUri);
    }
  };

  const handleButtonPress = () => {
    if (analysisResult) {
      pickImage();
    } else {
      handleAnalyze();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
        <View style={styles.container}>
          <ImagePickerView imageUri={imageUri} onPickImage={pickImage} />
          <AnalysisResultView analysisResult={analysisResult} />
          <AnalyzeButton
            loading={loading}
            imageUri={imageUri}
            analysisResult={analysisResult}
            onPress={handleButtonPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    minHeight: size.block.xxlarge,
  },
});