import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../constants/colors';
import { createEvent, getCurrentUser, getUserProfile } from '../services/firebaseService';

interface CreateEventScreenProps {
  navigation?: any;
}

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Error', 'Please enter an event date');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter an event location');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter an event description');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to create an event');
        setIsSubmitting(false);
        return;
      }

      const profile = await getUserProfile(user.uid);
      if (!profile) {
        Alert.alert('Error', 'Failed to load user profile');
        setIsSubmitting(false);
        return;
      }

      const newEvent = await createEvent({
        title: title.trim(),
        date: date.trim(),
        location: location.trim(),
        description: description.trim(),
        category: category.trim() || undefined,
        link: link.trim() || undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        attendees: 0,
        hostId: user.uid,
        hostName: profile.name,
      });

      Alert.alert(
        'Success',
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Austin Tech Networking Mixer"
                placeholderTextColor={colors.textGray}
                editable={!isSubmitting}
              />
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="e.g., December 20, 2025"
                placeholderTextColor={colors.textGray}
                editable={!isSubmitting}
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Downtown Austin Convention Center"
                placeholderTextColor={colors.textGray}
                editable={!isSubmitting}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Technology, All Levels"
                placeholderTextColor={colors.textGray}
                editable={!isSubmitting}
              />
            </View>

            {/* Capacity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                value={capacity}
                onChangeText={setCapacity}
                placeholder="e.g., 200"
                placeholderTextColor={colors.textGray}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>

            {/* Link */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website/Link</Text>
              <TextInput
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholder="e.g., https://example.com"
                placeholderTextColor={colors.textGray}
                keyboardType="url"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your event..."
                placeholderTextColor={colors.textGray}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[styles.createButton, isSubmitting && styles.createButtonDisabled]}
              onPress={handleCreateEvent}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.helperText}>
              * Required fields
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(77, 196, 196, 0.2)',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  createButton: {
    backgroundColor: colors.cyan,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  helperText: {
    fontSize: 13,
    color: colors.textGray,
    textAlign: 'center',
  },
});
