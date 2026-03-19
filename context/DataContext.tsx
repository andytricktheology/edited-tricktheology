
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BlogPost, MerchItem, Book, PodcastEpisode, Comment, Page, AdminConfig } from '../types';
import { BLOG_POSTS, MERCH, BOOKS, PODCASTS, MOCK_COMMENTS, INITIAL_PAGES, DEFAULT_ADMIN } from '../constants';

interface DataContextType {
  posts: BlogPost[];
  merch: MerchItem[];
  books: Book[];
  podcasts: PodcastEpisode[];
  comments: Comment[];
  pages: Page[];
  adminConfig: AdminConfig;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: () => void;
  logout: () => void;
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  addPodcast: (podcast: Omit<PodcastEpisode, 'id'>) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  addMerch: (item: Omit<MerchItem, 'id'>) => void;
  addPage: (page: Omit<Page, 'id' | 'lastModified'>) => void;
  updatePage: (id: string, page: Partial<Page>) => void;
  addComment: (comment: Omit<Comment, 'id' | 'status' | 'date'>) => void;
  updateCommentStatus: (id: string, status: 'approved' | 'pending') => void;
  deleteItem: (type: 'posts' | 'podcasts' | 'books' | 'merch' | 'comments' | 'pages', id: string) => void;
  updateAdmin: (config: AdminConfig) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Core slugs required for site navigation
const SYSTEM_SLUGS = ['about', 'privacy-policy', 'terms-of-service'];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_ADMIN);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tt_auth_token') === 'true';
  });

  // Fetch data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
          setMerch(data.merch || []);
          setBooks(data.books || []);
          setPodcasts(data.podcasts || []);
          setComments(data.comments || []);
          setPages(data.pages || []);
          setAdminConfig(data.adminConfig || DEFAULT_ADMIN);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Save data to server whenever it changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            posts, merch, books, podcasts, comments, pages, adminConfig
          })
        });
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 500); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [posts, merch, books, podcasts, comments, pages, adminConfig, isLoaded]);

  // Aggressive recovery for system pages
  useEffect(() => {
    if (!isLoaded) return;
    const missingSystemPages = INITIAL_PAGES.filter(
      ip => !pages.some(p => p.slug === ip.slug)
    );
    if (missingSystemPages.length > 0) {
      setPages(prev => [...prev, ...missingSystemPages]);
    }
  }, [pages, isLoaded]);

  const login = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('tt_auth_token', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tt_auth_token');
  };

  const addPost = (post: Omit<BlogPost, 'id' | 'date'>) => {
    const newPost: BlogPost = { ...post, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
    setPosts([newPost, ...posts]);
  };

  const updatePost = (id: string, updatedFields: Partial<BlogPost>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const addPodcast = (podcast: Omit<PodcastEpisode, 'id'>) => {
    const newPodcast: PodcastEpisode = { ...podcast, id: Date.now().toString() };
    setPodcasts([newPodcast, ...podcasts]);
  };

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = { ...book, id: Date.now().toString() };
    setBooks([newBook, ...books]);
  };

  const addMerch = (item: Omit<MerchItem, 'id'>) => {
    const newItem: MerchItem = { ...item, id: Date.now().toString() };
    setMerch(prev => [newItem, ...(prev || [])]);
  };

  const addPage = (page: Omit<Page, 'id' | 'lastModified'>) => {
    const newPage: Page = { ...page, id: Date.now().toString(), lastModified: new Date().toISOString() };
    setPages(prev => [...prev, newPage]);
  };

  const updatePage = (id: string, updatedFields: Partial<Page>) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields, lastModified: new Date().toISOString() } : p));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'status' | 'date'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setComments([newComment, ...comments]);
  };

  const updateCommentStatus = (id: string, status: 'approved' | 'pending') => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const updateAdmin = (config: AdminConfig) => {
    setAdminConfig(config);
  };

  const deleteItem = (type: 'posts' | 'podcasts' | 'books' | 'merch' | 'comments' | 'pages', id: string) => {
    if (type === 'pages') {
      const pageToDelete = pages.find(p => p.id === id);
      if (pageToDelete && SYSTEM_SLUGS.includes(pageToDelete.slug)) {
        return; // Protection active
      }
    }

    switch (type) {
      case 'posts': setPosts(prev => prev.filter(i => i.id !== id)); break;
      case 'podcasts': setPodcasts(prev => prev.filter(i => i.id !== id)); break;
      case 'books': setBooks(prev => prev.filter(i => i.id !== id)); break;
      case 'merch': setMerch(prev => prev.filter(i => i.id !== id)); break;
      case 'comments': setComments(prev => prev.filter(i => i.id !== id)); break;
      case 'pages': setPages(prev => prev.filter(i => i.id !== id)); break;
    }
  };

  return (
    <DataContext.Provider value={{ 
      posts, merch, books, podcasts, comments, pages, adminConfig, isAuthenticated, isLoaded, login, logout,
      addPost, updatePost, addPodcast, addBook, addMerch, addPage, updatePage, addComment, updateCommentStatus, deleteItem, updateAdmin 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
