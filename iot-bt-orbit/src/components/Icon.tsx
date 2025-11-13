import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// Emoji icon mapping
const iconMap: { [key: string]: string } = {
  'compass-outline': '🧭',
  'person-outline': '👤',
  'person': '👤',
  'business-outline': '🏢',
  'people': '👥',
  'globe-outline': '🌐',
  'calendar-outline': '📅',
  'location-outline': '📍',
  'link-outline': '🔗',
  'logo-linkedin': '💼',
  'star-outline': '⭐',
  'star': '⭐',
  'options-outline': '⚙️',
  'chevron-back': '←',
  'chevron-down': '▼',
  'chevron-up': '▲',
  'search': '🔍',
  'add': '+',
  'image-outline': '🖼️',
  'people-outline': '👥',
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  const emoji = iconMap[name] || '●';
  
  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color: color,
        },
        style,
      ]}
    >
      {emoji}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
