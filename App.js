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
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function App() {

const [screen, setScreen] = useState('Home');
const [filter, setFilter] = useState('All');

  const [menuItem, setMenuItem] = useState('');
  const [menuItemDescription, setMenuItemDescription] = useState('');
  const [price, setPrice] = useState('');
  const [option, setOption] = useState(null);
  const [clients, setClients] = useState([]);

  const clearForm = () => {
    setMenuItem('');
    setMenuItemDescription('');
    setPrice('');
    setOption(null);
  };

  const openAddMenuItemScreen = () => {
    clearForm();
    setScreen('Add');
  };

  const addMenuItem = () => {
    const cleanMenuItem = menuItem.trim();
    const cleanMenuItemDescription = menuItemDescription.trim();
    const menuItemPrice = Number(price);
    const dishOptions = [
    { label: 'Starter', value: 'Starter' },
    { label: 'Main Course', value: 'Main Course' },
    { label: 'Dessert', value: 'Dessert' },
  ];

    if (cleanMenuItem === '') {
      Alert.alert('Missing information', 'Please enter a menu item name.');
    } else if (cleanMenuItemDescription === '') {
      Alert.alert('Missing information', 'Please enter a menu item description.');
    } else if (price.trim() === '') {
      Alert.alert('Invalid Price', 'Please enter a valid price above zero.');
    } else {
      const newMenuItem = {
        id: Date.now().toString(),
        name: cleanMenuItem,
        description: cleanMenuItemDescription,
        price: menuItemPrice,
        course: option,
      };

      setMenuItens((currentMenuItems) => [
        ...currentMenuItems,
        newMenuItem,
      ]);

      clearForm();
      setFilter('All');
      setScreen('Home');

      Alert.alert('Success', 'Menu item added successfully!');
    }
  };

  const deleteMenuItem = (menuItemId) => {
    setMenuItens((currentMenuItems) =>
      currentMenuItems.filter((item) => item.id !== menuItemId)
    );
  };

  const confirmDelete = (menuItem) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${menuItem.name}"?`,
      [
        { text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMenuItem(menuItem.id),
        },
      ]
    );
  };

  const calculateAverage = (selectedCourse) => {
    const categoryItems = clients.filter(
      (item) => item.course === selectedCourse
    );

    if (categoryItems.length === 0) {
      return 0;
    };

    const total = categoryItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    return total / categoryItems.length;
  };

  const formatPrice = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const filteredMenuItems = items.filter((item) => {
    if (filter === 'All') {
      return true;
    }
    
    return item.course === filter;
  });

  const sortedMenuItems = [...filteredMenuItems].sort(
    (firstItem, secondItem) =>
      firstItem.price - secondItem.price
  );
  
  const MenuItemTypeButton = ({title}) => {
    const selected = course === title;

    return (
      <TouchableOpacity
        style={[
          styles.menuItemTypeButton,
          selected && styles.selectedMenuItemType,
        ]}
        onPress={() => setCourse(title)}
      >
           <Text
            style={[
              styles.menuItemTypeText,
              selected && styles.selectedButtonText,
            ]}
          >
            {title}
          </Text>
       </TouchableOpacity>
    );
  };

const FilterButton = ({title}) => {
    const selected = filter === title;

    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          selected && styles.selectedFilterButton,
        ]}
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

const AverageCard = ({ title, courseName}) => {
    return (
      <View style={styles.averageCard}>
        <Text style={styles.AverageTitle}>{title}</Text>
        <Text style={styles.averageAmount}>
          {formatPrice(calculateAverage(courseName))}
        </Text>
      </View>
    );
  };

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sortedMenuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text Style={styles.mainTitle}>Christofell's Chef App</Text>
              <Text style={styles.subTitle}>Manage Your Menu Items
              </Text>
            </View>

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
         <AverageCard title="Average Dessert Price" courseName="Dessert" 
         />
        
         <Text style={styles.sectionTitle}>Filter Menu Items</Text>

         <ScrollView
           horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            >
              <FilterButton title="All" />
              <FilterButton title="Starter" />
              <FilterButton title="Main Course" />
              <FilterButton title="Dessert" />
         </ScrollView>

        <View style={styles.listHeading}>
          <Text style={styles.sectionTitle}>
            {filter === 'All' ? 'All Menu Items' : filter}
          </Text>

          <Text style={styles.itemCount}>
            {sortedMenuItems.length}{''}
            {sortedMenuItems.length === 1
              ? ' item'
              : ' items'}
          </Text>
        </View>

        {sortedMenuItems.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No Menu Items Listed
            </Text>

            <Text style={styles.emptyText}>
              Add a menu item or select another filter.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={openAddMenuItemScreen}
              >
                <Text style={styles.emptyButtonText}>
                  Add First Menu Item
                </Text>
              </TouchableOpacity>
          </View>
        )}
      </>
      }
    renderItem={({item}) => (
      <View style={styles.menuItemCard}>
        <View style={styles.menuItemHeader}>
          <View style={styles.menuItemDetails}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemDescription}>
              {item.description}
            </Text>
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {item.course}
            </Text>
          </View>
        </View>

        <Text style={styles.menuItemPrice}>
          {formatPrice(item.price)}
        </Text>

        <Text style={styles.priceDescription}>
          {item.category === 'Starter'
            ? 'Starter'
            : item.category === 'Main Course'
            ? 'Main Course'
            : 'Dessert'}
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item)}
          >
            <Text style={styles.deleteButtonText}>
              Delete Menu Item
            </Text>
          </TouchableOpacity>
      </View>
    )}
    />
     </SafeAreaView>
  );
};

const AddMenuItemScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={styles.screen}>
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    {'>'}
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setScreen('Home')}
            >
              <Text style={styles.backButoonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>Add Menu Item</Text>
          </View>

          <Text style={styles.formDescription}>
            Enter the menu item information and select how the menu item will be listed.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Menu Item Name</Text>

            <TextInput
            style={styles.input}
            placeholder="Enter Menu Item Name"
            placeholderTextColor="#FFFFFF"
            value={menuItem}
            onChangeText={setMenuItem}
            />

            <Text style={styles.label}>Menu Item Description</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Menu Item Description"
              placeholderTextColor="#FFFFFF"
              value={menuItemDescription}
              onChangeText={setMenuItemDescription}
            />

            <Text style={styles.label}>Dish Course</Text>

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={[
                { label: 'Starter', value: 'Starter' },
                { label: 'Main Course', value: 'Main Course' },
                { label: 'Dessert', value: 'Dessert' }
              ]}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Select Dish Course"
              value={option}
              onChange={(item) => {
                setOption(item.value);
              }}
            />

            <Text style={styles.label}>Price</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Price"
              placeholderTextColor="#FFFFFF"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <View style={styles.selectionBox}>
              <Text style={styles.selectionBoxText}>
                Selected Dish Course: {option || 'None'}
              </Text>

              <Text style={styles.selectionValue}>{category}</Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={addMenuItem}
            >
              <Text style={styles.saveButtonText}>Add Menu Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScreen('Home')}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


   const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: '#E1607C',
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F3859D',
    paddingHorizontal: 12,
    marginBottom: 12,
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

  placeholderStyle: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  button: {
    backgroundColor: '#ED94A8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: '#ED94A8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#b84c65',
    elevation: 2,
  },

  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
