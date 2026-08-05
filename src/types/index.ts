export interface Bookmark {
  id: string;
  title?: string;
  url: string;
  boardName: string;
  pageName?: string;
  status?: 'deleted' | 'active';
  boardColumnIndex?: number;
  boardOrder?: number;
  bookmarkOrder?: number;
  icon?: string;
  category?: string;
}

export interface Board {
  name: string;
  columnIndex: number;
  boardOrder: number;
  accentHex: string;
  pageName?: string;
}

export interface CustomBoardMeta {
  name: string;
  columnIndex?: number;
  boardOrder?: number;
  accentHex?: string;
  pageName?: string;
}

export interface ToastData {
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
  editingBookmark: Bookmark | null;
  availableBoards: string[];
  availablePages: string[];
  currentPage: string;
  defaultBoard: string | null;
}

export interface AddBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBoard: (board: { name: string; columnIndex: number; accentColor: string }) => void;
  availablePages: string[];
  currentPage: string;
}

export interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPage: (pageName: string) => void;
}

export interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  customBoardsMeta: CustomBoardMeta[];
  brightnessMode: string;
  glassMode: string;
  onImportFullWorkspace: (data: {
    importedBookmarks: Bookmark[];
    importedBoardsMeta: CustomBoardMeta[];
    importedPreferences?: { brightnessMode?: string; glassMode?: string };
  }) => void;
  onResetData: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  boards: Board[];
  pages: string[];
  currentPage: string;
  onSelectPage: (pageName: string) => void;
  onOpenAddModal: (boardName?: string | null) => void;
  onOpenAddBoardModal: () => void;
  onOpenAddPageModal: () => void;
  onOpenImportExportModal: () => void;
  onToggleBlur: () => void;
  onOpenShareCardModal: () => void;
}

export interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  boards: Board[];
  bookmarksCount: number;
}
