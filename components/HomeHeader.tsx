import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

interface HeaderProps {
  completedCount: number;
  totalTasks: number;
  onPressStats: () => void;
}

export const Header = ({ completedCount, totalTasks, onPressStats }: HeaderProps) => {
  const progressPercentage = totalTasks > 0 
    ? Math.round((completedCount / totalTasks) * 100)
    : 0;

  return (
    <LinearGradient
      colors={[Colors.accentLight, Colors.accent]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.5 }}
    >
      <View style={styles.content}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="sync-circle"
              size={32}
              color="rgba(255,255,255,0.9)"
              style={styles.logo}
            />
            <Text style={styles.title}>ekiliSync</Text>
          </View>

          <TouchableOpacity
            style={styles.statsButton}
            onPress={onPressStats}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.3)']}
              style={styles.statsContent}
            >
              <Ionicons name="stats-chart" size={20} color="white" />
              <Text style={styles.statsText}>
                {completedCount}/{totalTasks}
              </Text>
              <View style={[
                styles.progressBar,
                { width: `${progressPercentage}%` }
              ]} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Sync Your Productivity</Text>
      </View>

      {/* Background elements */}
      <View style={styles.backgroundOrb1} />
      <View style={styles.backgroundOrb2} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'visible',
  },
  content: {
    paddingHorizontal: 24,
    zIndex: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  statsButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statsText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  backgroundOrb1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    left: -30,
    transform: [{ rotate: '30deg' }],
  },
  backgroundOrb2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -20,
    right: -20,
    transform: [{ rotate: '-15deg' }],
  },
});