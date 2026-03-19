
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  image: string;
  date: string;
}

export type BlogCategory = 
  | 'Wisdom' 
  | 'Truth' 
  | 'Secrets' 
  | 'Theological Tricks' 
  | 'Prophecy' 
  | 'Global Politics' 
  | 'Names and Codes';

export interface MerchItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  platform: 'TeePublic' | 'Redbubble' | 'Printful';
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buyLink: string;
  platform: 'Amazon' | 'Google Play' | 'PDF Download';
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  episodeNumber: number;
  embedUrl: string; // RedCircle, Spotify, or YouTube
  platform: 'YouTube' | 'Spotify' | 'RedCircle';
}

export interface Comment {
  id: string;
  postId: string; // Linked to BlogPost id
  user: string;
  text: string;
  status: 'pending' | 'approved';
  date: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  seoExcerpt: string;
  lastModified: string;
}

export interface AdminConfig {
  email: string;
  passwordHash: string; // Mock hash for this implementation
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
