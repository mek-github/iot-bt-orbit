import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import { BottomNav } from '../components/BottomNav';
import { SkeletonCard } from '../components/SkeletonCard';

const { width } = Dimensions.get('window');

interface ProgressiveLoadingScreenProps {
  stage: 1 | 2 | 3 | 4;
  userName?: string;
  onLoadComplete?: () => void;
}

export const ProgressiveLoadingScreen: React.FC<ProgressiveLoadingScreenProps> = ({
  stage,
  userName = 'Farah',
  onLoadComplete,
}) => {
  const renderContent = () => {
    const cardWidth = width - Spacing.screenPadding * 2;

    switch (stage) {
      case 2:
        return (
          <View style={styles.cardsContainer}>
            <SkeletonCard width={cardWidth} height={170} style={styles.card} />
            <SkeletonCard width={cardWidth} height={170} style={styles.card} />
          </View>
        );
      case 3:
        return (
          <View style={styles.cardsContainer}>
            <SkeletonCard width={cardWidth} height={150} style={styles.card} />
            <SkeletonCard width={cardWidth} height={150} style={styles.card} />
            <SkeletonCard width={cardWidth} height={150} style={styles.card} />
          </View>
        );
      case 4:
        return (
          <View style={styles.cardsContainer}>
            <View style={[styles.splitCard, { width: cardWidth }]}>
              <View style={styles.splitCardTop} />
              <View style={styles.splitCardBottom} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ORBIT</Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Your connections are aligning — welcome to Orbit, {userName}.
          </Text>
        </View>

        {/* Content Cards */}
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <BottomNav theme="light" showCenterIcon={true} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  logo: {
    ...Typography.appTitle,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  welcomeSection: {
    marginTop: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  welcomeText: {
    ...Typography.headline,
    fontSize: 22,
    color: Colors.light.primaryText,
    lineHeight: 30,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  card: {
    marginBottom: Spacing.lg,
  },
  splitCard: {
    height: 420,
    borderRadius: 18,
    overflow: 'hidden',
  },
  splitCardTop: {
    flex: 0.6,
    backgroundColor: '#A8A8A8',
  },
  splitCardBottom: {
    flex: 0.4,
    backgroundColor: Colors.light.placeholder,
  },
});
