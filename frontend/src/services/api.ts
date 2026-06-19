import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
}

export interface SkillItem {
  id?: number;
  skillName: string;
  skillLevel: string;
  userId: number;
}

export interface AnalysisResponse {
  id: number;
  skillName: string;
  currentLevel: string;
  missingSkills: string[];
  recommendation: string; // "1. title | resource | type\n2. ..."
  evaluation: string;
  analyzedDate: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/users/login', { email, password });
    return response.data;
  },
  register: async (fullName: string, email: string, password: string): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/users/register', { fullName, email, password });
    return response.data;
  },
  getAll: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/api/users');
    return response.data;
  },
};

export const skillService = {
  getAll: async (): Promise<SkillItem[]> => {
    const response = await api.get<SkillItem[]>('/api/skills');
    return response.data;
  },
  create: async (skillName: string, skillLevel: string, userId: number): Promise<SkillItem> => {
    const response = await api.post<SkillItem>('/api/skills', { skillName, skillLevel, userId });
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/skills/${id}`);
  },
};

export const analysisService = {
  run: async (skillName: string, currentLevel: string): Promise<AnalysisResponse> => {
    const response = await api.post<AnalysisResponse>('/api/analysis', { skillName, currentLevel });
    return response.data;
  },
  getAll: async (): Promise<AnalysisResponse[]> => {
    const response = await api.get<AnalysisResponse[]>('/api/analysis');
    return response.data;
  },
};

export interface RecommendationItem {
  skillName: string;
  importance: string;
  topics: string[];
  resources: string[];
  practiceProjects: string[];
}

export interface RoadmapWeekItem {
  week: string;
  title: string;
  topics: string[];
  estimatedHours: number;
  progress: number;
}

export interface RoleAnalysisResponse {
  id: number;
  userId: number;
  targetRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  gapPercentage: number;
  readinessScore: number;
  recommendations: RecommendationItem[];
  roadmap: RoadmapWeekItem[];
  analyzedDate: string;
}

export const roleAnalysisService = {
  run: async (userId: number, targetRole: string): Promise<RoleAnalysisResponse> => {
    const response = await api.post<RoleAnalysisResponse>('/api/analysis/role', { userId, targetRole });
    return response.data;
  },
  getHistory: async (userId: number): Promise<RoleAnalysisResponse[]> => {
    const response = await api.get<RoleAnalysisResponse[]>(`/api/analysis/role/user/${userId}`);
    return response.data;
  },
  getLatest: async (userId: number): Promise<RoleAnalysisResponse> => {
    const response = await api.get<RoleAnalysisResponse>(`/api/analysis/role/user/${userId}/latest`);
    return response.data;
  },
};

export default api;
