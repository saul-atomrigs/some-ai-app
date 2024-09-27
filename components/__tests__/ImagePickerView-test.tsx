import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ImagePickerView from '../ImagePickerView';

describe('ImagePickerView', () => {
  it('renders placeholder text when imageUri is null', () => {
    const { getByText } = render(<ImagePickerView imageUri={null} onPickImage={() => {}} />);
    expect(getByText('대화 스크린샷을 업로드해주세요')).toBeTruthy();
  });

  it('renders image when imageUri is provided', () => {
    const { getByTestId } = render(<ImagePickerView imageUri="test-uri" onPickImage={() => {}} />);
    const image = getByTestId('image');
    expect(image.props.source.uri).toBe('test-uri');
  });

  it('calls onPickImage when placeholder is pressed', () => {
    const onPickImageMock = jest.fn();
    const { getByText } = render(<ImagePickerView imageUri={null} onPickImage={onPickImageMock} />);
    fireEvent.press(getByText('대화 스크린샷을 업로드해주세요'));
    expect(onPickImageMock).toHaveBeenCalled();
  });

  it('calls onPickImage when image is pressed', () => {
    const onPickImageMock = jest.fn();
    const { getByTestId } = render(<ImagePickerView imageUri="test-uri" onPickImage={onPickImageMock} />);
    fireEvent.press(getByTestId('image'));
    expect(onPickImageMock).toHaveBeenCalled();
  });
});
