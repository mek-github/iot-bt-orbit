import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import { loginUser, signUpUser } from '../services/firebaseService';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  navigation?: any;
  route?: {
    params: {
      role: 'attendee' | 'host' | 'recruiter';
    };
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const role = route?.params?.role || 'attendee';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Recruiter-specific fields
  const [company, setCompany] = useState('');
  const [recruitingFor, setRecruitingFor] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (isSignUp && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const additionalInfo = role === 'recruiter' ? { company, recruitingFor, lookingFor } : undefined;
        await signUpUser(email, password, name, role, additionalInfo);
        Alert.alert('Success', 'Account created! Please log in.');
        setIsSignUp(false);
        setPassword('');
      } else {
        // Login existing user
        const userProfile = await loginUser(email, password);
        
        // Verify role matches
        if (userProfile.role !== role) {
          Alert.alert('Error', `This account is registered as a ${userProfile.role}, not a ${role}`);
          setLoading(false);
          return;
        }

        // Navigate based on role
        if (role === 'attendee') {
          navigation?.replace('OrbitVisualization');
        } else if (role === 'recruiter') {
          navigation?.replace('RecruiterDashboard');
        } else {
          navigation?.replace('HostDashboard');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={styles.roleText}>
            {isSignUp ? 'Sign up' : 'Log in'} as {role === 'attendee' ? 'Attendee' : role === 'recruiter' ? 'Recruiter' : 'Host'}
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputContainer}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          {isSignUp && role === 'recruiter' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={company}
                onChangeText={setCompany}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Recruiting For (e.g., Software Engineering)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={recruitingFor}
                onChangeText={setRecruitingFor}
              />
              <TextInput
                style={styles.input}
                placeholder="Looking For (e.g., Entry level, 2+ years)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={lookingFor}
                onChangeText={setLookingFor}
              />
            </>
          )}
        </View>

        {/* Login/Sign Up Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleAuth}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.loginButtonText}>
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle Sign Up/Log In */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: colors.white,
  },
  header: {
    marginTop: '20%',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.7,
  },
  inputContainer: {
    marginTop: 60,
    paddingHorizontal: 40,
  },
  input: {
    backgroundColor: colors.inputDark,
    borderWidth: 1,
    borderColor: colors.cardDark,
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    color: colors.white,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: colors.cyan,
    width: width - 80,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  toggleButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: colors.cyan,
    textDecorationLine: 'underline',
  },
});
