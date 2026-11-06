import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.searchBarContainer}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#888"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor="#888"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color="#888" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSearch}
        accessibilityLabel="Submit search"
      >
        <Ionicons name="arrow-forward" size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const FILTERS = ['All', 'Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [screen, setScreen] = useState('Home');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    course: null,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      course: null,
    });
    setEditingItemId(null);
  };

  const openAddMenuItemScreen = () => {
    resetForm();
    setScreen('Add');
  };

  const openEditMenuItemScreen = (menuItem) => {
    setEditingItemId(menuItem.id);
    setFormData({
      name: menuItem.name,
      description: menuItem.description,
      price: String(menuItem.price),
      course: menuItem.course,
    });
    setScreen('Add');
  };

  const updateFormField = (field, value) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  };

  const saveMenuItem = () => {
    const cleanMenuItem = formData.name.trim();
    const cleanMenuItemDescription = formData.description.trim();
    const menuItemPrice = Number(formData.price);

    if (cleanMenuItem === '') {
      Alert.alert('Missing information', 'Please enter a menu item name.');
      return;
    }

    if (cleanMenuItemDescription === '') {
      Alert.alert('Missing information', 'Please enter a menu item description.');
      return;
    }

    if (!Number.isFinite(menuItemPrice) || menuItemPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price above zero.');
      return;
    }

    if (!formData.course) {
      Alert.alert('Missing information', 'Please select a dish course.');
      return;
    }

    if (editingItemId) {
      setMenuItems((currentMenuItems) =>
        currentMenuItems.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                name: cleanMenuItem,
                description: cleanMenuItemDescription,
                price: menuItemPrice,
                course: formData.course,
              }
            : item
        )
      );

      Alert.alert('Success', 'Menu item updated successfully!');
    } else {
      const newMenuItem = {
        id: Date.now().toString(),
        name: cleanMenuItem,
        description: cleanMenuItemDescription,
        price: menuItemPrice,
        course: formData.course,
      };

      setMenuItems((currentMenuItems) => [...currentMenuItems, newMenuItem]);
      Alert.alert('Success', 'Menu item added successfully!');
    }

    resetForm();
    setFilter('All');
    setScreen('Home');
  };

  const deleteMenuItem = (menuItemId) => {
    setMenuItems((currentMenuItems) =>
      currentMenuItems.filter((item) => item.id !== menuItemId)
    );
  };

  const confirmDelete = (menuItem) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${menuItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMenuItem(menuItem.id),
        },
      ]
    );
  };

  const calculateAverage = (selectedCourse) => {
    const categoryItems = menuItems.filter((item) => item.course === selectedCourse);

    if (categoryItems.length === 0) {
      return 0;
    }

    const total = categoryItems.reduce((sum, item) => sum + item.price, 0);
    return total / categoryItems.length;
  };

  const formatPrice = (amount) =>
    `R ${Number(amount || 0).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCourse = filter === 'All' || item.course === filter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = [item.name, item.description, item.course].some((value) =>
      value.toLowerCase().includes(query)
    );

    return matchesCourse && matchesSearch;
  });

  const sortedMenuItems = [...filteredMenuItems].sort(
    (firstMenuItem, secondMenuItem) => firstMenuItem.price - secondMenuItem.price
  );

  const FilterButton = ({ title }) => {
    const selected = filter === title;

    return (
      <TouchableOpacity
        style={[styles.filterButton, selected && styles.selectedFilterButton]}
        onPress={() => setFilter(title)}
      >
        <Text
          style={[
            styles.filterButtonText,
            selected && styles.selectedFilterButtonText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const AverageCard = ({ title, courseName }) => (
    <View style={styles.averageCard}>
      <Text style={styles.averageTitle}>{title}</Text>
      <Text style={styles.averageAmount}>{formatPrice(calculateAverage(courseName))}</Text>
    </View>
  );

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemHeader}>
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.course}</Text>
        </View>
      </View>

      <Text style={styles.menuItemPrice}>{formatPrice(item.price)}</Text>
      <Text style={styles.priceDescription}>{item.course}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditMenuItemScreen(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HomeHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.mainTitle}>Christofell's Chef App</Text>
          <Text style={styles.subTitle}>Manage Your Menu Items</Text>
        </View>

        <SearchBar onSearch={setSearchQuery} />

        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddMenuItemScreen}
        >
          <Text style={styles.addButtonText}>Add Menu Item</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Average Prices</Text>
      <AverageCard title="Average Starter Price" courseName="Starter" />
      <AverageCard title="Average Main Course Price" courseName="Main Course" />
      <AverageCard title="Average Dessert Price" courseName="Dessert" />

      <Text style={styles.sectionTitle}>Filter Menu Items</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((title) => (
          <FilterButton key={title} title={title} />
        ))}
      </ScrollView>

      <View style={styles.listHeading}>
        <Text style={styles.sectionTitle}>
          {filter === 'All' ? 'All Menu Items' : filter}
        </Text>

        <Text style={styles.itemCount}>
          {sortedMenuItems.length}
          {sortedMenuItems.length === 1 ? ' item' : ' items'}
        </Text>
      </View>

      {sortedMenuItems.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Menu Items Listed</Text>
          <Text style={styles.emptyText}>
            Add a menu item or select another filter.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={openAddMenuItemScreen}
          >
            <Text style={styles.emptyButtonText}>Add First Menu Item</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const HomeScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sortedMenuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={HomeHeader}
      />
    </SafeAreaView>
  );

  const AddMenuItemScreen = () => {
    const isEditMode = editingItemId !== null;

    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  resetForm();
                  setScreen('Home');
                }}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}
              </Text>
            </View>

            <Text style={styles.formDescription}>
              {isEditMode
                ? 'Update the menu item details below.'
                : 'Enter the menu item information and select how the menu item will be listed.'}
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.label}>Menu Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Menu Item Name"
                placeholderTextColor="#FFFFFF"
                value={formData.name}
                onChangeText={(value) => updateFormField('name', value)}
              />

              <Text style={styles.label}>Menu Item Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Menu Item Description"
                placeholderTextColor="#FFFFFF"
                value={formData.description}
                onChangeText={(value) => updateFormField('description', value)}
              />

              <Text style={styles.label}>Dish Course</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={[
                  { label: 'Starter', value: 'Starter' },
                  { label: 'Main Course', value: 'Main Course' },
                  { label: 'Dessert', value: 'Dessert' },
                ]}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Dish Course"
                value={formData.course}
                onChange={(selectedCourse) => updateFormField('course', selectedCourse.value)}
              />

              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                placeholderTextColor="#FFFFFF"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(value) => updateFormField('price', value)}
              />

              <View style={styles.selectionBox}>
                <Text style={styles.selectionBoxText}>
                  Selected Dish Course: {formData.course || 'None'}
                </Text>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveMenuItem}>
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Update Menu Item' : 'Add Menu Item'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  setScreen('Home');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  if (screen === 'Add') {
    return <AddMenuItemScreen />;
  }

  return <HomeScreen />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E1607C',
  },

  screen: {
    flex: 1,
  },

  homeContent: {
    padding: 18,
    paddingBottom: 50,
  },

  header: {
    marginBottom: 26,
  },

  headerText: {
    marginBottom: 16,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  subTitle: {
    fontSize: 15,
    color: '#FFFFFF',
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#333333',
  },

  clearButton: {
    padding: 4,
  },

  submitButton: {
    backgroundColor: '#b84c65',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },

  addButton: {
    backgroundColor: '#ed94a8',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  averageCard: {
    backgroundColor: '#ED94A8',
    borderWidth: 1,
    borderColor: '#b84c65',
    borderRadius: 10,
    padding: 15,
    marginBottom: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  averageTitle: {
    fontSize: 15,
    color: '#FFFFFF',
  },

  averageAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  filterRow: {
    paddingBottom: 24,
  },

  filterButton: {
    backgroundColor: '#b84c65',
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 15,
    marginRight: 8,
  },

  selectedFilterButton: {
    backgroundColor: '#ED94A8',
  },

  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  selectedFilterButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemCount: {
    color: '#FFFFFF',
    marginBottom: 12,
  },

  menuItemCard: {
    backgroundColor: '#ED94A8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#b84c65',
    elevation: 2,
  },

  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  menuItemDetails: {
    flex: 1,
    marginRight: 10,
  },

  menuItemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  menuItemDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },

  categoryBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  categoryBadgeText: {
    color: '#b84c65',
    fontSize: 12,
    fontWeight: '700',
  },

  menuItemPrice: {
    fontSize: 21,
    fontWeight: '700',
    color: '#76283a',
  },

  priceDescription: {
    fontSize: 13,
    color: '#b84c65',
    marginTop: 2,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#f9d7df',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },

  editButtonText: {
    color: '#7f2341',
    fontWeight: '700',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE4E2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  deleteButtonText: {
    color: '#B42318',
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: '#ec89a0',
    borderWidth: 1,
    borderColor: '#d13156',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  emptyText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },

  emptyButton: {
    backgroundColor: '#d13156',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  formContent: {
    padding: 18,
    paddingBottom: 50,
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  backButton: {
    backgroundColor: '#de869b6f',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 14,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  formTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  formDescription: {
    fontSize: 15,
    lineHeight: 21,
    color: '#FFFFFF',
    marginBottom: 20,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#d7d7d7',
    borderRadius: 12,
    padding: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dd9191',
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F3859D',
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#FFFFFF',
  },

  dropdown: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F3859D',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  selectedTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  selectionBox: {
    backgroundColor: '#F3859D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },

  selectionBoxText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#ffffff56',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#dd5e79',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    backgroundColor: '#df93a4bb',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelButtonText: {
    color: '#f7214f',
    fontSize: 15,
    fontWeight: '700',
  },
});