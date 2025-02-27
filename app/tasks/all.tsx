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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { Task, getTasks, updateTask, deleteTask } from "@/utils/ekilisync";
import { Header } from "@/components/HomeHeader";

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      setRefreshing(true);
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
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

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Header
        completedCount={completedCount}
        totalTasks={tasks.length}
        onPressStats={() => router.push("/")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadTasks}
            tintColor={Colors.accent}
          />
        }
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/tasks/add")}
            >
              <Text style={styles.addButtonText}>Create New Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => router.push(`/tasks/${task.id}`)}
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
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(task.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
                {task.description && (
                  <Text style={styles.taskDescription}>
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
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tasks/add")}
      >
        <LinearGradient
          colors={[Colors.accentLight, Colors.accent]}
          style={styles.fabGradient}
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
    padding: 20,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
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
    marginBottom: 4,
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
  },
  statusButton: {
    padding: 8,
    borderRadius: 20,
  },
  completedStatus: {
    backgroundColor: "#E8F5E9",
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});