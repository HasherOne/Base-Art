
import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { commonStyles, colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';

const { width } = Dimensions.get('window');
const itemWidth = (width - spacing.md * 3) / 2;

// Mock data for artworks
const artworks = [
  {
    id: '1',
    title: 'Digital Sunset',
    artist: 'ArtistOne',
    price: '1.2 ETH',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
    category: 'Abstract',
    verified: true,
    likes: 234,
  },
  {
    id: '2',
    title: 'Cyber City',
    artist: 'NeonCreator',
    price: '2.8 ETH',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    category: 'Digital',
    verified: true,
    likes: 567,
  },
  {
    id: '3',
    title: 'Geometric Dreams',
    artist: 'ShapeShifter',
    price: '0.9 ETH',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'Geometric',
    verified: false,
    likes: 123,
  },
  {
    id: '4',
    title: 'Fluid Motion',
    artist: 'FlowArt',
    price: '1.5 ETH',
    image: 'https://images.unsplash.com/photo-1635776062043-223faf322554?w=400&h=400&fit=crop',
    category: 'Abstract',
    verified: true,
    likes: 345,
  },
  {
    id: '5',
    title: 'Neon Waves',
    artist: 'WaveRider',
    price: '3.1 ETH',
    image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=400&h=400&fit=crop',
    category: 'Digital',
    verified: true,
    likes: 789,
  },
  {
    id: '6',
    title: 'Crystal Formation',
    artist: 'CrystalMind',
    price: '2.2 ETH',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
    category: 'Abstract',
    verified: false,
    likes: 456,
  },
];

const categories = ['All', 'Abstract', 'Digital', 'Geometric', 'Photography', 'AI Art'];
const sortOptions = ['Recent', 'Price: Low to High', 'Price: High to Low', 'Most Liked'];

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Recent');
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  console.log('MarketplaceScreen rendered');

  const toggleLike = (artworkId: string) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(artworkId)) {
      newLikedItems.delete(artworkId);
    } else {
      newLikedItems.add(artworkId);
    }
    setLikedItems(newLikedItems);
    console.log('Toggled like for artwork:', artworkId);
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderArtworkItem = ({ item }: { item: typeof artworks[0] }) => (
    <TouchableOpacity
      style={{
        width: itemWidth,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.sm,
      }}
      onPress={() => console.log('Artwork selected:', item.title)}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: '100%',
            height: itemWidth,
            backgroundColor: colors.backgroundAlt,
          }}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            width: 32,
            height: 32,
            borderRadius: borderRadius.full,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => toggleLike(item.id)}
        >
          <Icon
            name={likedItems.has(item.id) ? "heart" : "heart-outline"}
            size={18}
            color={likedItems.has(item.id) ? colors.error : colors.text}
          />
        </TouchableOpacity>
        {item.verified && (
          <View
            style={{
              position: 'absolute',
              top: spacing.sm,
              left: spacing.sm,
              backgroundColor: colors.success,
              borderRadius: borderRadius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            }}
          >
            <Icon name="checkmark" size={12} color={colors.background} />
          </View>
        )}
      </View>
      <View style={{ padding: spacing.sm }}>
        <Text
          style={[commonStyles.text, commonStyles.textBold, { fontSize: 14 }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: spacing.xs }]}
          numberOfLines={1}
        >
          by {item.artist}
        </Text>
        <View style={[commonStyles.spaceBetween, { alignItems: 'flex-end' }]}>
          <Text style={[commonStyles.text, commonStyles.textBold, { fontSize: 14 }]}>
            {item.price}
          </Text>
          <View style={[commonStyles.row, { alignItems: 'center' }]}>
            <Icon name="heart" size={12} color={colors.textLight} />
            <Text style={[commonStyles.small, { marginLeft: 2, color: colors.textLight }]}>
              {item.likes}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = (category: string) => (
    <TouchableOpacity
      key={category}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: selectedCategory === category ? colors.primary : colors.backgroundAlt,
        marginRight: spacing.sm,
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
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.spaceBetween, commonStyles.px_md, commonStyles.py_md]}>
        <Text style={[commonStyles.subtitle, { fontSize: 24 }]}>
          Marketplace
        </Text>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setShowFilters(true);
            console.log('Filters pressed');
          }}
        >
          <Icon name="options" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[commonStyles.px_md, commonStyles.mb_md]}>
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
            placeholder="Search artworks..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={commonStyles.mb_md}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
        >
          {categories.map(renderCategoryItem)}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={[commonStyles.px_md, commonStyles.mb_md]}>
        <Text style={commonStyles.textSecondary}>
          {filteredArtworks.length} artworks found
        </Text>
      </View>

      {/* Artworks Grid */}
      <FlatList
        data={filteredArtworks}
        renderItem={renderArtworkItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <View style={{ padding: spacing.lg }}>
          <Text style={[commonStyles.subtitle, commonStyles.mb_lg]}>
            Filters & Sort
          </Text>
          
          <Text style={[commonStyles.heading, commonStyles.mb_md]}>
            Sort By
          </Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                commonStyles.row,
                commonStyles.py_md,
                { justifyContent: 'space-between' }
              ]}
              onPress={() => {
                setSelectedSort(option);
                console.log('Sort option selected:', option);
              }}
            >
              <Text style={commonStyles.text}>{option}</Text>
              {selectedSort === option && (
                <Icon name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          
          <View style={[commonStyles.divider, commonStyles.my_lg]} />
          
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: 'center',
            }}
            onPress={() => {
              setShowFilters(false);
              console.log('Filters applied');
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
    </View>
  );
}
