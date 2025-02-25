import AsyncStorage from "@react-native-async-storage/async-storage";

const TASK_LISTS_KEY = "@task_lists";
const PARTNER_KEY = "@partner";

export interface TaskItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskList {
  id: string;
  name: string;
  createdAt: string;
  items: TaskItem[];
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  connected: boolean;
}

// TASK LIST FUNCTIONS
export async function getTaskLists(): Promise<TaskList[]> {
  try {
    const data = await AsyncStorage.getItem(TASK_LISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting task lists:", error);
    return [];
  }
}

export async function addTaskList(taskList: TaskList): Promise<void> {
  try {
    const lists = await getTaskLists();
    lists.push(taskList);
    await AsyncStorage.setItem(TASK_LISTS_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error("Error adding task list:", error);
    throw error;
  }
}

export async function updateTaskList(updatedList: TaskList): Promise<void> {
  try {
    const lists = await getTaskLists();
    const index = lists.findIndex((list) => list.id === updatedList.id);
    if (index !== -1) {
      lists[index] = updatedList;
      await AsyncStorage.setItem(TASK_LISTS_KEY, JSON.stringify(lists));
    }
  } catch (error) {
    console.error("Error updating task list:", error);
    throw error;
  }
}

export async function deleteTaskList(id: string): Promise<void> {
  try {
    const lists = await getTaskLists();
    const updatedLists = lists.filter((list) => list.id !== id);
    await AsyncStorage.setItem(TASK_LISTS_KEY, JSON.stringify(updatedLists));
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
}

// TASK ITEM FUNCTIONS
export async function addTaskItem(listId: string, taskItem: TaskItem): Promise<void> {
  try {
    const lists = await getTaskLists();
    const list = lists.find((l) => l.id === listId);
    if (list) {
      list.items.push(taskItem);
      await updateTaskList(list);
    }
  } catch (error) {
    console.error("Error adding task item:", error);
    throw error;
  }
}

export async function updateTaskItem(listId: string, updatedItem: TaskItem): Promise<void> {
  try {
    const lists = await getTaskLists();
    const list = lists.find((l) => l.id === listId);
    if (list) {
      const index = list.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        list.items[index] = updatedItem;
        await updateTaskList(list);
      }
    }
  } catch (error) {
    console.error("Error updating task item:", error);
    throw error;
  }
}

export async function deleteTaskItem(listId: string, itemId: string): Promise<void> {
  try {
    const lists = await getTaskLists();
    const list = lists.find((l) => l.id === listId);
    if (list) {
      list.items = list.items.filter((item) => item.id !== itemId);
      await updateTaskList(list);
    }
  } catch (error) {
    console.error("Error deleting task item:", error);
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
    await AsyncStorage.multiRemove([TASK_LISTS_KEY, PARTNER_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}
