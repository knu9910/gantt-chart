import { useQuery } from "@tanstack/react-query";

interface DoorayOrganization {
  id: string;
}

interface DoorayWiki {
  id: string;
}

interface DoorayDrive {
  id: string;
}

interface DoorayProject {
  id: string;
  code: string;
  description: string;
  state: string;
  scope: string;
  type: string;
  organization: DoorayOrganization;
  wiki: DoorayWiki;
  drive: DoorayDrive;
}

interface DoorayHeader {
  resultCode: number;
  resultMessage: string;
  isSuccessful: boolean;
}

interface DoorayResponse {
  header: DoorayHeader;
  result: DoorayProject[];
  totalCount: number;
}

export const useDoorayProjects = () => {
  return useQuery<DoorayResponse>({
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

export const useDoorayData = (
  path: string,
  queryParams?: Record<string, string>
) => {
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const url = `/api/dooray/${path}${queryString ? `?${queryString}` : ""}`;

  return useQuery<DoorayResponse>({
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
  return useDoorayData(`projects/${projectId}/posts`);
};

export const useDoorayProjectMilestones = (projectId: string) => {
  return useDoorayData(`projects/${projectId}/milestones`);
};

export const useDoorayProjectTags = (projectId: string) => {
  return useDoorayData(`projects/${projectId}/tags`);
};
