import { useQuery } from "@tanstack/react-query";

interface DoorayMember {
  type: string;
  member: {
    organizationMemberId: string;
    name: string;
    workflow?: {
      id: string;
      name: string;
    };
  };
}

interface DoorayUsers {
  from: DoorayMember;
  to: DoorayMember[];
  cc: DoorayMember[];
}

interface DoorayProject {
  id: string;
  code: string;
}

interface DoorayParent {
  id: string;
  number: number;
  subject: string;
}

interface DoorayTag {
  id: string;
}

interface DoorayMilestone {
  id: string;
  name: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DoorayWorkflow {
  id: string;
  name: string;
}

export interface DoorayPost {
  id: string;
  subject: string;
  project: DoorayProject;
  taskNumber: string;
  closed: boolean;
  createdAt: string;
  dueDateFlag: boolean;
  updatedAt: string;
  number: number;
  priority: string;
  parent?: DoorayParent;
  tags: DoorayTag[];
  users: DoorayUsers;
  endedAt?: string;
  fileIdList: string[];
  workflowClass: string;
  milestone: DoorayMilestone | null;
  workflow: DoorayWorkflow;
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
  return useQuery<DoorayResponse<DoorayProject>>({
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
  return useDoorayData<DoorayTag>(`projects/${projectId}/tags`);
};
