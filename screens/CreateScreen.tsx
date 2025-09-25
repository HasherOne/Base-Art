
import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { commonStyles, colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const categories = ['Art', 'Photography', 'Music', 'Video', 'Collectibles', 'Sports', 'Utility'];

export default function CreateScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Art');
  const [royalties, setRoyalties] = useState('10');

  console.log('CreateScreen rendered');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    if (!selectedImage || !title || !price) {
      Alert.alert('Missing Information', 'Please fill in all required fields and select an image.');
      return;
    }

    console.log('Creating NFT:', {
      image: selectedImage,
      title,
      description,
      price,
      category: selectedCategory,
      royalties,
    });

    Alert.alert(
      'NFT Created!',
      'Your NFT has been successfully created and will be available on the marketplace soon.',
      [{ text: 'OK', onPress: () => console.log('NFT creation confirmed') }]
    );
  };

  const renderCategoryItem = (category: string) => (
    <TouchableOpacity
      key={category}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: selectedCategory === category ? colors.primary : colors.backgroundAlt,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
      }}
      onPress={() => {
        setSelectedCategory(category);
        console.log('Category selected:', category);
      }}
    >
      <Text
        style={{
          color: selectedCategory === category ? colors.background : colors.text,
          fontWeight: selectedCategory === category ? '600' : '400',
        }}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[commonStyles.px_md, commonStyles.py_md]}>
        <Text style={[commonStyles.subtitle, { fontSize: 24 }]}>
          Create NFT
        </Text>
        <Text style={[commonStyles.textSecondary, commonStyles.mt_xs]}>
          Turn your digital art into an NFT on Base
        </Text>
      </View>

      {/* Image Upload */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <Text style={[commonStyles.heading, commonStyles.mb_md]}>
          Upload Artwork *
        </Text>
        <TouchableOpacity
          style={{
            height: 200,
            borderRadius: borderRadius.lg,
            borderWidth: 2,
            borderColor: colors.border,
            borderStyle: 'dashed',
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          onPress={pickImage}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Icon name="cloud-upload" size={48} color={colors.textLight} />
              <Text style={[commonStyles.text, commonStyles.mt_sm]}>
                Tap to upload image
              </Text>
              <Text style={[commonStyles.textLight, commonStyles.mt_xs]}>
                PNG, JPG, GIF up to 10MB
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <Text style={[commonStyles.heading, commonStyles.mb_md]}>
          Title *
        </Text>
        <TextInput
          style={{
            backgroundColor: colors.backgroundAlt,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            fontSize: 16,
            color: colors.text,
          }}
          placeholder="Enter artwork title"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <Text style={[commonStyles.heading, commonStyles.mb_md]}>
          Description
        </Text>
        <TextInput
          style={{
            backgroundColor: colors.backgroundAlt,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            fontSize: 16,
            color: colors.text,
            height: 100,
            textAlignVertical: 'top',
          }}
          placeholder="Describe your artwork..."
          placeholderTextColor={colors.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Category */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <Text style={[commonStyles.heading, commonStyles.mb_md]}>
          Category
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map(renderCategoryItem)}
        </View>
      </View>

      {/* Price */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <Text style={[commonStyles.heading, commonStyles.mb_md]}>
          Price *
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundAlt,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              fontSize: 16,
              color: colors.text,
            }}
            placeholder="0.00"
            placeholderTextColor={colors.textLight}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Text style={[commonStyles.text, { marginLeft: spacing.sm }]}>
            ETH
          </Text>
        </View>
      </View>

      {/* Royalties */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <Text style={[commonStyles.heading, commonStyles.mb_md]}>
          Royalties
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundAlt,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              fontSize: 16,
              color: colors.text,
            }}
            placeholder="10"
            placeholderTextColor={colors.textLight}
            value={royalties}
            onChangeText={setRoyalties}
            keyboardType="numeric"
          />
          <Text style={[commonStyles.text, { marginLeft: spacing.sm }]}>
            %
          </Text>
        </View>
        <Text style={[commonStyles.textLight, commonStyles.mt_xs]}>
          Suggested: 5-10%. You&apos;ll receive this percentage of sales price each time your NFT is sold.
        </Text>
      </View>

      {/* Preview Card */}
      {selectedImage && title && (
        <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
          <Text style={[commonStyles.heading, commonStyles.mb_md]}>
            Preview
          </Text>
          <View style={[commonStyles.card, { maxWidth: 250 }]}>
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: borderRadius.md,
                marginBottom: spacing.sm,
              }}
              resizeMode="cover"
            />
            <Text style={[commonStyles.text, commonStyles.textBold]} numberOfLines={1}>
              {title}
            </Text>
            {price && (
              <Text style={[commonStyles.text, commonStyles.mt_xs]}>
                {price} ETH
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Create Button */}
      <View style={[commonStyles.px_md, commonStyles.mb_xl]}>
        <TouchableOpacity onPress={handleCreate}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: borderRadius.md,
              padding: spacing.md,
              alignItems: 'center',
              ...shadows.md,
            }}
          >
            <Text style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Create NFT
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={[commonStyles.textLight, commonStyles.textCenter, commonStyles.mt_md]}>
          By creating, you agree to our Terms of Service
        </Text>
      </View>
    </ScrollView>
  );
}
