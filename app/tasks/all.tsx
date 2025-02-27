import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { Task, getTasks, updateTask, deleteTask } from "@/utils/ekilisync";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Header } from "@/components/HomeHeader";

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const loadTasks = async () => {
    try {
      setRefreshing(true);
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updatedTask = { ...task, completed: !task.completed };
        await updateTask(updatedTask);
        await loadTasks();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const renderRightActions = (progress: any, dragX: any, taskId: string) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => handleDeleteTask(taskId)}
        style={styles.deleteContainer}
      >
        <Animated.View style={[styles.deleteButton, { transform: [{ scale }] }]}>
          <Ionicons name="trash" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const filteredTasks = showCompleted 
    ? tasks.filter(t => t.completed)
    : tasks.filter(t => !t.completed);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Header
        completedCount={completedCount}
        totalTasks={tasks.length}
        onPressStats={() => router.push("/")}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !showCompleted && styles.activeFilter]}
          onPress={() => setShowCompleted(false)}
        >
          <Text style={[styles.filterText, !showCompleted && styles.activeFilterText]}>
            Active ({tasks.length - completedCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, showCompleted && styles.activeFilter]}
          onPress={() => setShowCompleted(true)}
        >
          <Text style={[styles.filterText, showCompleted && styles.activeFilterText]}>
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadTasks}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        {filteredTasks.length === 0 ? (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
            <Ionicons 
              name="rocket-outline" 
              size={72} 
              color={Colors.accentLight} 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyStateTitle}>
              {showCompleted ? "No Completed Tasks" : "All Clear!"}
            </Text>
            <Text style={styles.emptyStateText}>
              {showCompleted 
                ? "Complete some tasks to see them here"
                : "Tap the + button to add a new task"}
            </Text>
          </Animated.View>
        ) : (
          filteredTasks.map((task) => (
            <Swipeable
              key={task.id}
              renderRightActions={(progress, dragX) => 
                renderRightActions(progress, dragX, task.id)
              }
              friction={2}
            >
              <Animated.View 
                style={[styles.taskCard, { opacity: fadeAnim }]}
              >
                <TouchableOpacity
                  style={styles.taskContent}
                  onPress={() => router.push(`/tasks/task/${task.id}`)}
                >
                  <View style={styles.taskHeader}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.completedTitle,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      {task.dueDate && (
                        <View style={styles.dateBadge}>
                          <Ionicons name="calendar" size={14} color="#666" />
                          <Text style={styles.dateText}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {task.description && (
                    <Text 
                      style={styles.taskDescription}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {task.description}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    task.completed && styles.completedStatus,
                  ]}
                  onPress={() => handleToggleComplete(task.id)}
                >
                  {task.completed ? (
                    <LinearGradient
                      colors={['#4CAF50', '#388E3C']}
                      style={styles.statusGradient}
                    >
                      <Ionicons name="checkmark" size={20} color="white" />
                    </LinearGradient>
                  ) : (
                    <View style={styles.statusCircle}>
                      <Ionicons name="ellipse-outline" size={24} color="#666" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Swipeable>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tasks/add")}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[Colors.accentLight, Colors.accent]}
          style={styles.fabGradient}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        >
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: Colors.accentLight,
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statusGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  deleteContainer: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 16,
    marginBottom: 12,
    width: 80,
  },
  deleteButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    opacity: 0.8,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 30,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});