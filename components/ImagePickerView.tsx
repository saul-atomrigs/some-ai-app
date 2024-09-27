import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

interface ImagePickerViewProps {
  imageUri: string | null;
  onPickImage: () => void;
}

const ImagePickerView: React.FC<ImagePickerViewProps> = ({ imageUri, onPickImage }) => {
  return (
    <TouchableOpacity style={styles.placeholderContainer} onPress={onPickImage}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>대화 스크린샷을 업로드해주세요</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    width: size.relative.large,
    aspectRatio: 1,
    borderRadius: size.borderRadius.medium,
    borderWidth: size.lineWidth.small,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBackground,
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: size.borderRadius.medium,
    borderWidth: size.lineWidth.small,
    borderColor: colors.border,
  },
  placeholderText: {
    fontSize: typography.fontSize.md,
    color: colors.placeholderText,
    textAlign: 'center',
  },
});

export default ImagePickerView;