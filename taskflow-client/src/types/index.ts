export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse extends User {
  token: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  taskCount: number;
}

export type TaskStatus =
  | "Todo"
  | "InProgress"
  | "Review"
  | "Done";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus | number;
  priority: TaskPriority | number;
  dueDate?: string;
  createdAt: string;
  projectId: string;
  projectName: string;
  assignedUserId?: string;
  assignedUser?: string;
}