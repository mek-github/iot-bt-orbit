import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon } from '../components/Icon';

const { width } = Dimensions.get('window');

interface RecruiterCardProps {
  name: string;
  company: string;
}

const RecruiterCard: React.FC<RecruiterCardProps> = ({ name, company }) => (
  <View style={styles.recruiterCard}>
    <View style={styles.recruiterLeft}>
      <View style={styles.recruiterPhoto}>
        <Text style={styles.recruiterPhotoText}>👤</Text>
      </View>
      <View style={styles.recruiterInfo}>
        <Text style={styles.recruiterName}>{name}</Text>
        <View style={styles.companyRow}>
          <Text style={styles.recruiterCompany}>{company}</Text>
          <Text style={styles.linkedinIcon}> 🔗</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity>
      <Text style={styles.starIcon}>⭐</Text>
    </TouchableOpacity>
  </View>
);

interface EventDetailScreenProps {
  onBackPress?: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  onBackPress,
}) => {
  const [organizersExpanded, setOrganizersExpanded] = useState(false);
  const [recruitersExpanded, setRecruitersExpanded] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImage}>
            <Text style={styles.heroPlaceholder}>🏢</Text>
          </View>
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Content Card - Overlaps Image */}
        <View style={styles.contentCard}>
          {/* Title Row with Badge */}
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle}>Austin Small{'\n'}Business Expo</Text>
            <View style={styles.attendeeBadge}>
              <Text style={styles.badgeIcon}>🌐</Text>
              <Text style={styles.badgeText}>34</Text>
            </View>
          </View>

          {/* Meta Information */}
          <View style={styles.metaSection}>
            <Text style={styles.categoryText}>All Majors, Early Career</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>December 15th, 2025</Text>
            </View>
            
            <TouchableOpacity style={styles.metaRow}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>South Congress, Austin, TX</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.metaRow}>
              <Text style={styles.metaIcon}>🔗</Text>
              <Text style={[styles.metaText, styles.linkText]}>
                https://www.thesmallbusinessexpo.com/city/austin/
              </Text>
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.detailsText}>
              The Austin Small Business Expo is the city's biggest small business conference and one of the top networking events Austin has to offer. Join 2,000+ entrepreneurs, founders, and business owners at this premier event to learn how to increase revenue, scale smarter, and grow your network.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.starButton}
              onPress={() => setIsFavorited(!isFavorited)}
            >
              <Text style={styles.starButtonIcon}>{isFavorited ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>⚙️</Text>
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Organizers Section */}
          <TouchableOpacity
            style={styles.organizersSection}
            onPress={() => setOrganizersExpanded(!organizersExpanded)}
          >
            <Text style={styles.sectionTitle}>Organizers</Text>
            <Text style={styles.chevron}>{organizersExpanded ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {organizersExpanded && (
            <View style={styles.organizersContent}>
              <Text style={styles.placeholderText}>Organizer details coming soon...</Text>
            </View>
          )}

          {/* Recruiters Section */}
          <View style={styles.recruitersSection}>
            <TouchableOpacity
              style={styles.recruitersHeader}
              onPress={() => setRecruitersExpanded(!recruitersExpanded)}
            >
              <Text style={styles.recruitersSectionTitle}>Recruiters</Text>
              <Text style={styles.chevronWhite}>{recruitersExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {recruitersExpanded && (
              <View style={styles.recruitersList}>
                <RecruiterCard name="Sarah Johnson" company="Tech Innovations Inc." />
                <RecruiterCard name="Michael Chen" company="StartupHub Austin" />
                <RecruiterCard name="Emily Rodriguez" company="Growth Partners LLC" />
                <RecruiterCard name="David Kim" company="Austin Ventures" />
              </View>
            )}
          </View>

          {/* Spacer for scrolling */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholder: {
    fontSize: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -80,
    paddingTop: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    lineHeight: 32,
  },
  attendeeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  metaSection: {
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666666',
  },
  linkText: {
    color: '#4DC4C4',
  },
  detailsSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 23,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  starButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButtonIcon: {
    fontSize: 22,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    gap: 8,
  },
  filterIcon: {
    fontSize: 18,
  },
  filterButtonText: {
    fontSize: 15,
    color: '#666666',
  },
  organizersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 16,
  },
  organizersContent: {
    padding: 16,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
  },
  chevron: {
    fontSize: 16,
    color: '#000000',
  },
  recruitersSection: {
    backgroundColor: 'transparent',
    marginTop: 16,
  },
  recruitersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recruitersSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  chevronWhite: {
    fontSize: 16,
    color: '#000000',
  },
  recruitersList: {
    gap: 12,
  },
  recruiterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A3544',
    padding: 14,
    borderRadius: 14,
  },
  recruiterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recruiterPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3A4554',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recruiterPhotoText: {
    fontSize: 24,
  },
  recruiterInfo: {
    flex: 1,
  },
  recruiterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recruiterCompany: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  linkedinIcon: {
    fontSize: 14,
    color: '#4DC4C4',
  },
  starIcon: {
    fontSize: 24,
  },
});
