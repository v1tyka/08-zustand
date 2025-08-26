import axios from "axios";
import type { Note, NewNoteData } from "@/types/note";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL || "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTES_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  page: number;
  data: Note[];
  total_pages: number;
  perPage: number;
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<RawFetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag && tag !== "All" ? { tag } : {}),
    },
  });

  return {
    page,
    perPage,
    data: response.data.notes,
    total_pages: response.data.totalPages,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const response = await api.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
