import { useQuery } from "@tanstack/react-query";

interface DoorayProject {
  id: string;
  code: string;
  description?: string;
  drive?: {
    id: string;
  };
  organization?: {
    id: string;
  };
  scope: string;
  state: string;
  type: string;
  wiki?: {
    id: string;
  };
}

export interface DoorayMilestone {
  id: string;
  name: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoorayPost {
  id: string;
  subject: string;
  milestone?: {
    id: string;
    title: string;
  } | null;
  tags: {
    id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  closed: boolean;
  dueDateFlag: boolean;
  endedAt?: string;
  fileIdList: string[];
  number: number;
  parent?: {
    id: string;
    number: number;
    subject: string;
  };
  priority: string;
  project: {
    id: string;
    code: string;
  };
  taskNumber: string;
  users: {
    from: Record<string, any>;
    to: any[];
    cc: any[];
  };
  workflow: {
    id: string;
    name: string;
  };
  workflowClass: string;
}

interface DoorayHeader {
  resultCode: number;
  resultMessage: string;
  isSuccessful: boolean;
}

interface DoorayResponse<T> {
  header: DoorayHeader;
  result: T;
  totalCount: number;
}

export const useDoorayProjects = () => {
  return useQuery<DoorayResponse<DoorayProject[]>>({
    queryKey: ["dooray-projects"],
    queryFn: async () => {
      const response = await fetch("/api/dooray/projects");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch Dooray projects");
      }
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoorayData = <T>(
  path: string,
  queryParams?: Record<string, string>
) => {
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const url = `/api/dooray/${path}${queryString ? `?${queryString}` : ""}`;

  return useQuery<T>({
    queryKey: ["dooray", path, queryParams],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Dooray data");
      }
      return response.json();
    },
  });
};

export const useDoorayProjectPosts = (projectId: string) => {
  return useDoorayData<DoorayPost[]>(`projects/${projectId}/posts`);
};

export const useDoorayProjectMilestones = (projectId: string) => {
  return useDoorayData<DoorayMilestone[]>(`projects/${projectId}/milestones`);
};

export const useDoorayProjectTags = (projectId: string) => {
  return useDoorayData<DoorayTag[]>(`projects/${projectId}/tags`);
};

export interface DoorayTag {
  id: string;
  name: string;
  color: string;
  tagGroup: null | string;
}
