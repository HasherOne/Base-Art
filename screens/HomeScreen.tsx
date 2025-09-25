
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Dimensions 
} from 'react-native';
import { commonStyles, colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data for featured artworks
const featuredArtworks = [
  {
    id: '1',
    title: 'Cosmic Dreams',
    artist: 'DigitalVision',
    price: '2.5 ETH',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
    verified: true,
  },
  {
    id: '2',
    title: 'Neon Genesis',
    artist: 'CyberArt',
    price: '1.8 ETH',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    verified: true,
  },
  {
    id: '3',
    title: 'Abstract Reality',
    artist: 'ModernMint',
    price: '3.2 ETH',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    verified: false,
  },
];

const trendingCollections = [
  {
    id: '1',
    name: 'Base Builders',
    items: '1.2K',
    floorPrice: '0.8 ETH',
    change: '+12.5%',
    image: 'https://images.unsplash.com/photo-1635776062043-223faf322554?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Digital Landscapes',
    items: '856',
    floorPrice: '1.5 ETH',
    change: '+8.3%',
    image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=300&h=300&fit=crop',
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  console.log('HomeScreen rendered');

  const renderFeaturedArtwork = (artwork: typeof featuredArtworks[0]) => (
    <TouchableOpacity
      key={artwork.id}
      style={{
        width: width * 0.7,
        marginRight: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.md,
      }}
      onPress={() => console.log('Artwork pressed:', artwork.title)}
    >
      <Image
        source={{ uri: artwork.image }}
        style={{
          width: '100%',
          height: 200,
          backgroundColor: colors.backgroundAlt,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: spacing.md }}>
        <View style={[commonStyles.spaceBetween, commonStyles.mb_sm]}>
          <Text style={[commonStyles.heading, { fontSize: 18 }]} numberOfLines={1}>
            {artwork.title}
          </Text>
          {artwork.verified && (
            <Icon name="checkmark-circle" size={20} color={colors.success} />
          )}
        </View>
        <Text style={[commonStyles.textSecondary, commonStyles.mb_sm]}>
          by {artwork.artist}
        </Text>
        <View style={commonStyles.spaceBetween}>
          <Text style={[commonStyles.text, commonStyles.textBold]}>
            {artwork.price}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
            }}
            onPress={() => console.log('Buy now pressed:', artwork.title)}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTrendingCollection = (collection: typeof trendingCollections[0]) => (
    <TouchableOpacity
      key={collection.id}
      style={[
        commonStyles.card,
        commonStyles.mb_md,
        { flexDirection: 'row', alignItems: 'center' }
      ]}
      onPress={() => console.log('Collection pressed:', collection.name)}
    >
      <Image
        source={{ uri: collection.image }}
        style={{
          width: 60,
          height: 60,
          borderRadius: borderRadius.md,
          marginRight: spacing.md,
          backgroundColor: colors.backgroundAlt,
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.heading, { fontSize: 16, marginBottom: 4 }]}>
          {collection.name}
        </Text>
        <Text style={commonStyles.textSecondary}>
          {collection.items} items • Floor: {collection.floorPrice}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: colors.success, fontWeight: '600' }}>
          {collection.change}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={commonStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[commonStyles.spaceBetween, commonStyles.px_md, commonStyles.py_md]}>
        <View>
          <Text style={[commonStyles.heading, { fontSize: 28, marginBottom: 4 }]}>
            Base Art
          </Text>
          <Text style={commonStyles.textSecondary}>
            Discover digital masterpieces
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => console.log('Notifications pressed')}
        >
          <Icon name="notifications" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundAlt,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Icon name="search" size={20} color={colors.textLight} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: spacing.sm,
              fontSize: 16,
              color: colors.text,
            }}
            placeholder="Search artworks, artists, collections..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats Banner */}
      <View style={[commonStyles.mx_md, commonStyles.mb_lg]}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
          }}
        >
          <Text style={{
            color: colors.background,
            fontSize: 20,
            fontWeight: '700',
            marginBottom: spacing.sm,
          }}>
            Base Network Stats
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: colors.background, fontSize: 24, fontWeight: '800' }}>
                12.5K
              </Text>
              <Text style={{ color: colors.background, opacity: 0.8 }}>
                Total Volume
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.background, fontSize: 24, fontWeight: '800' }}>
                3.2K
              </Text>
              <Text style={{ color: colors.background, opacity: 0.8 }}>
                Active Users
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.background, fontSize: 24, fontWeight: '800' }}>
                856
              </Text>
              <Text style={{ color: colors.background, opacity: 0.8 }}>
                Collections
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Featured Artworks */}
      <View style={commonStyles.mb_lg}>
        <View style={[commonStyles.spaceBetween, commonStyles.px_md, commonStyles.mb_md]}>
          <Text style={[commonStyles.subtitle, { fontSize: 22 }]}>
            Featured Artworks
          </Text>
          <TouchableOpacity onPress={() => console.log('View all featured pressed')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
        >
          {featuredArtworks.map(renderFeaturedArtwork)}
        </ScrollView>
      </View>

      {/* Trending Collections */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <View style={[commonStyles.spaceBetween, commonStyles.mb_md]}>
          <Text style={[commonStyles.subtitle, { fontSize: 22 }]}>
            Trending Collections
          </Text>
          <TouchableOpacity onPress={() => console.log('View all collections pressed')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        {trendingCollections.map(renderTrendingCollection)}
      </View>

      {/* Quick Actions */}
      <View style={[commonStyles.px_md, commonStyles.mb_xl]}>
        <Text style={[commonStyles.subtitle, { fontSize: 22, marginBottom: spacing.md }]}>
          Quick Actions
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[
              commonStyles.card,
              { 
                flex: 1, 
                marginRight: spacing.sm, 
                alignItems: 'center',
                paddingVertical: spacing.lg,
              }
            ]}
            onPress={() => console.log('Create NFT pressed')}
          >
            <Icon name="add-circle" size={32} color={colors.primary} />
            <Text style={[commonStyles.text, commonStyles.mt_sm, commonStyles.textBold]}>
              Create NFT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyles.card,
              { 
                flex: 1, 
                marginLeft: spacing.sm, 
                alignItems: 'center',
                paddingVertical: spacing.lg,
              }
            ]}
            onPress={() => console.log('My Collection pressed')}
          >
            <Icon name="grid" size={32} color={colors.accent} />
            <Text style={[commonStyles.text, commonStyles.mt_sm, commonStyles.textBold]}>
              My Collection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
