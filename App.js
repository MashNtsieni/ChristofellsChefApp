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

    // 2. Create the new client/record object
    const newClient = {
      id: Date.now().toString(),
      menuItem,
      menuItemDescription,
      price,
      // Extract string value if option is an object
  course: typeof option === 'object' && option !== null ? (option.label || option.value) : option,
    };

    // 3. Add to state immutably
    setClients(prevClients => [...prevClients, newClient]);

    // 4. Clear all inputs
    setMenuItem('');
    setMenuItemDescription('');
    setPrice('');
    setOption(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Christofell's Chef App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Menu Item Name"
        value={menuItem}
        onChangeText={setMenuItem}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Menu Item Description"
        value={menuItemDescription}
        onChangeText={setMenuItemDescription}
      />

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={dishOptions}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder="Select Dish Course"
        value={option}
        onChange={(item) => {
          setOption(item.value);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={addClient}>
        <Text style={styles.buttonText}>Add Record</Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>Submitted Records</Text>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Menu Item: {item.menuItem} 
             </Text>
             <Text style={styles.cardText}>
  Menu Item Description: {item.menuItemDescription}
</Text>
            <Text style={styles.cardText}>
              Dish Course: {item.course}
            </Text>
            <Text style={styles.cardText}>
              Price: R{item.price}
            </Text>
         </View>
        )}
      />
    </View>
  );


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
