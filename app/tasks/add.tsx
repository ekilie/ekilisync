import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { Task, addTask } from "../../utils/ekilisync"; 

export default function AddTaskScreen() {
  const router = useRouter();
  const [form, setForm] = useState<Pick<Task, "title" | "description">>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: form.title,
      description: form.description,
    };

    try {
      await addTask(newTask);
      Alert.alert(
        "Success",
        "Task added successfully",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert(
        "Error",
        "Failed to save task. Please try again.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.accentLight, Colors.accent]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.accent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
        </View>

        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={styles.formContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Task Title"
              placeholderTextColor="#999"
              value={form.title}
              onChangeText={(text) => {
                setForm({ ...form, title: text });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              maxLength={60}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
                errors.description && styles.inputError,
              ]}
              placeholder="Task Description"
              placeholderTextColor="#999"
              value={form.description}
              onChangeText={(text) => {
                setForm({ ...form, description: text });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={[Colors.accentLight, Colors.accent]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? "Saving..." : "Save Task"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 140 : 120,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginLeft: 15,
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionInput: {
    height: 150,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
});