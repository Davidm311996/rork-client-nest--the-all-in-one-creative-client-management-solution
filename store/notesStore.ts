import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/note';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  searchQuery: string;
  
  // Actions
  createNote: (title?: string, content?: string) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      isLoading: false,
      searchQuery: '',

      createNote: (title = '', content = '') => {
        const newNote: Note = {
          id: `note_${Date.now()}`,
          title: title || 'New Note',
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          notes: [newNote, ...state.notes]
        }));
        
        return newNote;
      },

      updateNote: (id: string, updates: Partial<Note>) => {
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id 
              ? { 
                  ...note, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                }
              : note
          )
        }));
      },

      deleteNote: (id: string) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id)
        }));
      },

      getNoteById: (id: string) => {
        return get().notes.find(note => note.id === id);
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      getFilteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery.trim()) return notes;
        
        const query = searchQuery.toLowerCase();
        return notes.filter(note => 
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        );
      },
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);