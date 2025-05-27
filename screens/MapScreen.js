import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 36.8065,
    longitude: 10.1815,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTraffic, setShowTraffic] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchRadius, setSearchRadius] = useState(2000);
  const [sortBy, setSortBy] = useState('distance');

  const mapRef = useRef();

  // Sample data for locations
  const locations = [
    {
      id: 1,
      name: 'FitZone Gym',
      category: 'Gyms',
      latitude: 36.8085,
      longitude: 10.1835,
      rating: 4.5,
      distance: '0.8 km',
      hours: 'Open until 10 PM',
      price: '$$',
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      description: 'Modern gym with latest equipment',
      equipment: ['Cardio', 'Weights', 'Pool', 'Sauna'],
      phone: '+216 71 123 456',
    },
    {
      id: 2,
      name: 'Healthy Bites',
      category: 'Healthy Food',
      latitude: 36.8045,
      longitude: 10.1795,
      rating: 4.2,
      distance: '1.2 km',
      hours: 'Open until 9 PM',
      price: '$',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      description: 'Fresh salads and healthy meals',
      cuisine: 'Mediterranean',
      phone: '+216 71 987 654',
    },
    {
      id: 3,
      name: 'PowerHouse Fitness',
      category: 'Gyms',
      latitude: 36.8105,
      longitude: 10.1775,
      rating: 4.7,
      distance: '1.5 km',
      hours: 'Open 24/7',
      price: '$$$',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Premium fitness center',
      equipment: ['CrossFit', 'Boxing', 'Yoga', 'Personal Training'],
      phone: '+216 71 456 789',
    },
    {
      id: 4,
      name: 'Bio Lab Medical',
      category: 'Labs',
      latitude: 36.8025,
      longitude: 10.1855,
      rating: 4.1,
      distance: '2.1 km',
      hours: 'Open until 6 PM',
      price: '$$',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      description: 'Comprehensive medical testing',
      services: ['Blood tests', 'X-Ray', 'Ultrasound'],
      phone: '+216 71 321 654',
    },
    {
      id: 5,
      name: 'Green Smoothie Bar',
      category: 'Healthy Food',
      latitude: 36.8055,
      longitude: 10.1825,
      rating: 4.3,
      distance: '0.5 km',
      hours: 'Open until 8 PM',
      price: '$',
      image:
        'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400',
      description: 'Fresh smoothies and juices',
      cuisine: 'Organic',
      phone: '+216 71 654 321',
    },
    {
      id: 6,
      name: 'Central Medical Lab',
      category: 'Labs',
      latitude: 36.8095,
      longitude: 10.1795,
      rating: 4.0,
      distance: '1.8 km',
      hours: 'Open until 5 PM',
      price: '$',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      description: 'Quick lab results',
      services: ['PCR tests', 'Blood work', 'Allergies'],
      phone: '+216 71 789 123',
    },
  ];

  const categories = [
    { name: 'All', icon: 'apps', count: locations.length },
    {
      name: 'Gyms',
      icon: 'fitness-center',
      count: locations.filter((l) => l.category === 'Gyms').length,
    },
    {
      name: 'Healthy Food',
      icon: 'restaurant',
      count: locations.filter((l) => l.category === 'Healthy Food').length,
    },
    {
      name: 'Labs',
      icon: 'science',
      count: locations.filter((l) => l.category === 'Labs').length,
    },
  ];

  const recentlyVisited = [
    { id: 1, name: 'FitZone Gym', lastVisit: '2 days ago' },
    { id: 2, name: 'Healthy Bites', lastVisit: '1 week ago' },
  ];

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationEnabled(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'Please enable location services to find nearby places.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchesCategory =
      selectedCategory === 'All' || location.category === selectedCategory;
    const matchesSearch =
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.price.length - b.price.length;
      default: // distance
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance);
    }
  });
  const getMarkerIcon = (category) => {
    switch (category) {
      case 'Gyms':
        return '🏋️';
      case 'Healthy Food':
        return '🍎';
      case 'Labs':
        return '🔬';
      default:
        return '📍';
    }
  };
  const generateLeafletHTML = () => {
    const markersData = filteredLocations.map((location) => ({
      id: location.id,
      name: location.name,
      lat: location.latitude,
      lng: location.longitude,
      category: location.category,
      description: location.description,
      rating: location.rating,
      distance: location.distance,
      hours: location.hours,
      price: location.price,
      icon: getMarkerIcon(location.category),
      color: getCategoryColor(location.category),
    }));

    const userLat = userLocation?.latitude || region.latitude;
    const userLng = userLocation?.longitude || region.longitude;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaflet Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .custom-marker {
            background: transparent;
            border: none;
            font-size: 20px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .leaflet-popup-content-wrapper {
            border-radius: 10px;
            padding: 0;
        }
        .popup-content {
            padding: 15px;
            min-width: 200px;
        }
        .popup-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
            color: #333;
        }
        .popup-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .popup-details {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: #888;
        }
        .popup-rating {
            color: #FFD700;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        const map = L.map('map').setView([${userLat}, ${userLng}], 13);
        
        // Add tile layer - using OpenStreetMap (free)
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Satellite layer option
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 19
        });

        let currentLayer = 'standard';

        // User location marker
        ${
          userLocation
            ? `
        const userIcon = L.divIcon({
            html: '<div style="background: #4CAF50; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
            className: 'custom-marker',
            iconSize: [21, 21],
            iconAnchor: [10.5, 10.5]
        });
        
        L.marker([${userLat}, ${userLng}], { icon: userIcon })
            .addTo(map)
            .bindPopup('<div class="popup-content"><div class="popup-title">Your Location</div></div>');

        // Search radius circle
        L.circle([${userLat}, ${userLng}], {
            color: '#42A5F5',
            fillColor: '#42A5F5',
            fillOpacity: 0.1,
            radius: ${searchRadius}
        }).addTo(map);
        `
            : ''
        }

        // Location markers
        const markers = ${JSON.stringify(markersData)};
        
        markers.forEach(marker => {
            const customIcon = L.divIcon({
                html: \`<div style="background: \${marker.color}; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">\${marker.icon}</div>\`,
                className: 'custom-marker',
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            });
            
            const popupContent = \`
                <div class="popup-content">
                    <div class="popup-title">\${marker.name}</div>
                    <div class="popup-description">\${marker.description}</div>
                    <div class="popup-details">
                        <span class="popup-rating">⭐ \${marker.rating}</span>
                        <span>\${marker.distance}</span>
                        <span>\${marker.hours}</span>
                        <span>\${marker.price}</span>
                    </div>
                </div>
            \`;
            
            L.marker([marker.lat, marker.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(popupContent)
                .on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'markerClick',
                        marker: marker
                    }));
                });
        });

        // Map controls
        window.toggleMapType = function() {
            if (currentLayer === 'standard') {
                map.removeLayer(tileLayer);
                map.addLayer(satelliteLayer);
                currentLayer = 'satellite';
            } else {
                map.removeLayer(satelliteLayer);
                map.addLayer(tileLayer);
                currentLayer = 'standard';
            }
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapTypeChanged',
                mapType: currentLayer
            }));
        };

        window.centerOnUser = function() {
            ${
              userLocation
                ? `
            map.setView([${userLat}, ${userLng}], 15);
            `
                : ''
            }
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'centerOnUser'
            }));
        };

        // Traffic simulation (visual overlay)
        let trafficLayer;
        window.toggleTraffic = function(show) {
            if (show && !trafficLayer) {
                // Create a simple traffic simulation with colored lines on major roads
                trafficLayer = L.layerGroup();
                
                // Add some sample traffic lines (in a real app, this would come from traffic API)
                const trafficLines = [
                    { coords: [[${userLat + 0.01}, ${userLng - 0.01}], [${
      userLat + 0.01
    }, ${userLng + 0.01}]], color: '#FF6B6B' },
                    { coords: [[${userLat - 0.005}, ${userLng - 0.01}], [${
      userLat + 0.005
    }, ${userLng + 0.01}]], color: '#FFC107' },
                    { coords: [[${userLat - 0.01}, ${userLng}], [${
      userLat + 0.01
    }, ${userLng}]], color: '#4CAF50' }
                ];
                
                trafficLines.forEach(line => {
                    L.polyline(line.coords, {
                        color: line.color,
                        weight: 5,
                        opacity: 0.7
                    }).addTo(trafficLayer);
                });
                
                trafficLayer.addTo(map);
            } else if (!show && trafficLayer) {
                map.removeLayer(trafficLayer);
                trafficLayer = null;
            }
        };

        // Listen for zoom changes
        map.on('zoomend', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'zoomChanged',
                zoom: map.getZoom()
            }));
        });

        // Listen for map moves
        map.on('moveend', function() {
            const center = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapMoved',
                center: { lat: center.lat, lng: center.lng }
            }));
        });
    </script>
</body>
</html>
    `;
  };
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'markerClick': {
          const marker = data.marker;
          const location = filteredLocations.find((l) => l.id === marker.id);
          if (location) {
            setSelectedMarker(location);
          }
          break;
        }
        case 'mapTypeChanged': {
          setMapType(data.mapType);
          break;
        }
        case 'centerOnUser': {
          // Handle center on user action if needed
          break;
        }
        case 'zoomChanged': {
          // Handle zoom changes if needed
          break;
        }
        case 'mapMoved': {
          // Handle map moves if needed
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };
  const renderHeader = () => (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nearby Places</Text>
          <TouchableOpacity
            style={[
              styles.locationToggle,
              { backgroundColor: locationEnabled ? '#4CAF50' : '#E0E0E0' },
            ]}
            onPress={() => setLocationEnabled(!locationEnabled)}
          >
            <Ionicons
              name="location"
              size={16}
              color={locationEnabled ? '#FFF' : '#666'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowTraffic(!showTraffic)}
          >
            <MaterialIcons
              name="traffic"
              size={20}
              color={showTraffic ? '#4CAF50' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              setMapType(mapType === 'standard' ? 'satellite' : 'standard')
            }
          >
            <MaterialIcons name="layers" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search nearby..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderCategoryTabs = () => (
    <View style={styles.categoryContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabs}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryTab,
              selectedCategory === category.name && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <MaterialIcons
              name={category.icon}
              size={18}
              color={selectedCategory === category.name ? '#FFF' : '#666'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                selectedCategory === category.name &&
                  styles.categoryBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  selectedCategory === category.name &&
                    styles.categoryBadgeTextActive,
                ]}
              >
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderLocationCard = ({ item }) => (
    <Animatable.View animation="fadeInUp" style={styles.locationCard}>
      <Image source={{ uri: item.image }} style={styles.locationImage} />
      <View style={styles.locationInfo}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.locationDescription}>{item.description}</Text>
        <View style={styles.locationDetails}>
          <View style={styles.locationDetailItem}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.locationDetailText}>{item.distance}</Text>
          </View>
          <View style={styles.locationDetailItem}>
            <Ionicons name="time" size={14} color="#666" />
            <Text style={styles.locationDetailText}>{item.hours}</Text>
          </View>
          <View style={styles.locationDetailItem}>
            <MaterialIcons name="attach-money" size={14} color="#666" />
            <Text style={styles.locationDetailText}>{item.price}</Text>
          </View>
        </View>{' '}
        {item.category === 'Gyms' && (
          <View style={styles.equipmentTags}>
            {item.equipment.slice(0, 2).map((eq) => (
              <View key={`equipment-${eq}`} style={styles.equipmentTag}>
                <Text style={styles.equipmentTagText}>{eq}</Text>
              </View>
            ))}
          </View>
        )}
        {item.category === 'Healthy Food' && (
          <View style={styles.cuisineTag}>
            <Text style={styles.cuisineText}>{item.cuisine} Cuisine</Text>
          </View>
        )}{' '}
        {item.category === 'Labs' && (
          <View style={styles.servicesTags}>
            {item.services.slice(0, 2).map((service) => (
              <View key={`service-${service}`} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.locationActions}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={16} color="#4CAF50" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.directionsButton}>
            <Ionicons name="navigate" size={16} color="#2196F3" />
            <Text style={styles.directionsButtonText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </Animatable.View>
  );

  const renderBottomSheetContent = () => (
    <View style={styles.bottomSheetContent}>
      <View style={styles.bottomSheetHandle} />
      <View style={styles.bottomSheetHeader}>
        <Text style={styles.bottomSheetTitle}>
          {filteredLocations.length} places found
        </Text>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'distance' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('distance')}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === 'distance' && styles.sortTextActive,
              ]}
            >
              Distance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'rating' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('rating')}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === 'rating' && styles.sortTextActive,
              ]}
            >
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {recentlyVisited.length > 0 && searchQuery === '' && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recently Visited</Text>
          {recentlyVisited.map((item) => (
            <View key={item.id} style={styles.recentItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.recentText}>{item.name}</Text>
              <Text style={styles.recentTime}>{item.lastVisit}</Text>
            </View>
          ))}
        </View>
      )}{' '}
      <ScrollView style={styles.locationsScrollView}>
        {sortedLocations.map((item) => renderLocationCard({ item }))}
      </ScrollView>
    </View>
  );
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderCategoryTabs()}{' '}
      <View style={styles.mapContainer}>
        {/* Leaflet Map Implementation */}
        <WebView
          ref={mapRef}
          source={{ html: generateLeafletHTML() }}
          style={styles.leafletMap}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mixedContentMode="compatibility"
          scalesPageToFit={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          injectedJavaScript={`
            // Inject traffic toggle when traffic state changes
            window.toggleTraffic(${showTraffic});
            
            // Inject map type toggle when map type changes
            if (window.toggleMapType && '${mapType}' !== window.currentLayer) {
              window.toggleMapType();
            }
          `}
        />

        {/* Map Controls Overlay */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={[
              styles.mapControlButton,
              { backgroundColor: showTraffic ? '#4CAF50' : '#FFF' },
            ]}
            onPress={() => setShowTraffic(!showTraffic)}
          >
            <MaterialIcons
              name="traffic"
              size={20}
              color={showTraffic ? '#FFF' : '#666'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={() => {
              setMapType(mapType === 'standard' ? 'satellite' : 'standard');
              // Inject JavaScript to toggle map type
              if (mapRef.current) {
                mapRef.current.postMessage('toggleMapType');
              }
            }}
          >
            <MaterialIcons name="layers" size={20} color="#666" />
            <Text style={styles.mapControlText}>
              {mapType === 'standard' ? 'SAT' : 'STD'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={() => {
              getCurrentLocation();
              // Center map on user location
              if (mapRef.current) {
                mapRef.current.postMessage('centerOnUser');
              }
            }}
          >
            <Ionicons name="locate" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      {selectedMarker && (
        <Animatable.View animation="slideInUp" style={styles.markerPopup}>
          <View style={styles.popupContent}>
            <Image
              source={{ uri: selectedMarker.image }}
              style={styles.popupImage}
            />
            <View style={styles.popupInfo}>
              <Text style={styles.popupName}>{selectedMarker.name}</Text>
              <Text style={styles.popupDescription}>
                {selectedMarker.description}
              </Text>
              <View style={styles.popupDetails}>
                <View style={styles.popupRating}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.popupRatingText}>
                    {selectedMarker.rating}
                  </Text>
                </View>
                <Text style={styles.popupDistance}>
                  {selectedMarker.distance}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.popupClose}
            onPress={() => setSelectedMarker(null)}
          >
            <Ionicons name="close" size={16} color="#666" />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Gyms':
      return '#FF6B6B';
    case 'Healthy Food':
      return '#4CAF50';
    case 'Labs':
      return '#2196F3';
    default:
      return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  locationToggle: {
    padding: 4,
    borderRadius: 12,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  voiceButton: {
    padding: 4,
  },
  myLocationButton: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 25,
  },
  categoryContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryTabs: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: 12,
  },
  categoryTabActive: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    marginRight: 6,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  categoryBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  categoryBadgeTextActive: {
    color: '#FFF',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  markerEmoji: {
    fontSize: 18,
  },
  markerPopup: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  popupContent: {
    flexDirection: 'row',
    padding: 16,
  },
  popupImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  popupInfo: {
    flex: 1,
  },
  popupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  popupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  popupDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  popupRatingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  popupDistance: {
    fontSize: 12,
    color: '#666',
  },
  popupClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  bottomSheetBackground: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginLeft: 4,
  },
  sortButtonActive: {
    backgroundColor: '#4CAF50',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  sortTextActive: {
    color: '#FFF',
  },
  recentSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recentText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  recentTime: {
    fontSize: 12,
    color: '#666',
  },
  locationsList: {
    paddingBottom: 100,
  },
  locationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  locationImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  locationInfo: {
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  locationDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  locationDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  locationDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  equipmentTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  equipmentTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  equipmentTagText: {
    fontSize: 12,
    color: '#1976D2',
  },
  cuisineTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  cuisineText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  servicesTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#F57C00',
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    marginRight: 12,
  },
  callButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    marginRight: 12,
  },
  directionsButtonText: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 4,
  },
  moreButton: {
    padding: 8,
  },

  // Simple Bottom Sheet Styles
  simpleBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationsScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  }, // Free Map Implementation Styles
  mapContainer: {
    flex: 1,
  },
  leafletMap: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
  },
  mapControlButton: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapControlText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
});

export default MapScreen;
