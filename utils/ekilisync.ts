import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "@tasks";
const PARTNER_KEY = "@partner";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  connected: boolean;
}

// TASK FUNCTIONS
export async function getTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting tasks:", error);
    return [];
  }
}

export async function addTask(task: Task): Promise<void> {
  try {
    const tasks = await getTasks();
    tasks.push({ ...task, completed: false });
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

export async function updateTask(updatedTask: Task): Promise<void> {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

// PARTNER FUNCTIONS
export async function getPartner(): Promise<Partner | null> {
  try {
    const data = await AsyncStorage.getItem(PARTNER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting partner info:", error);
    return null;
  }
}

export async function setPartner(partner: Partner): Promise<void> {
  try {
    await AsyncStorage.setItem(PARTNER_KEY, JSON.stringify(partner));
  } catch (error) {
    console.error("Error setting partner info:", error);
    throw error;
  }
}

export async function clearPartner(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PARTNER_KEY);
  } catch (error) {
    console.error("Error clearing partner info:", error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TASKS_KEY, PARTNER_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}
