import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

const useImageAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>('');

  /** 이미지를 base64로 인코딩 후 OpenAI API를 통해 이미지에서 텍스트를 추출하고, 이를 기반으로 이성 호감도를 분석하여 추천 대화를 생성합니다. */
  const analyzeImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract the text from this image.',
              },
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
        const prompt = `대화 내용에서 로맨틱한 관심(호감이나 이성적으로 좋아하는 감정)이 있으면 %로 나타내줘. 그리고 이어질 대화를 추천해줘.\n\대화:\n${extractedText}\n\n응답:`;

        const analysisResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: prompt }],
            },
          ],
        });

        setAnalysisResult(
          analysisResponse.choices[0]?.message?.content ||
            'No analysis result available.'
        );
      } else {
        setAnalysisResult('Failed to extract text from image.');
      }
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      setAnalysisResult('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, analysisResult, analyzeImage, setAnalysisResult };
};

export default useImageAnalyzer;
