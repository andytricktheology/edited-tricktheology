
import { BlogPost, MerchItem, Book, PodcastEpisode, Comment, Page, AdminConfig } from './types';

// Centralized brand logo URL - provided by user
export const BRAND_LOGO_URL = "https://res.cloudinary.com/docainyye/image/upload/v1768979446/Trick_Theology_Logo_2025_1_hvjtby.png";

// Emergency recovery key for resetting admin access
export const MASTER_RESET_SEED = "TRICK-THEOLOGY-RECOVERY-NODE-2025";

export const DEFAULT_ADMIN: AdminConfig = {
  email: "admin@gmail.com",
  passwordHash: "veilcipher"
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Hidden Codes in Genesis',
    excerpt: 'Uncovering the mathematical patterns buried within the first book of the Bible.',
    content: 'Long form content about Genesis codes...',
    category: 'Names and Codes',
    image: 'https://picsum.photos/seed/bible1/800/400',
    date: '2024-03-15'
  }
];

export const MERCH: MerchItem[] = [
  {
    id: 'm1',
    title: 'Prophecy Shield Tee',
    description: 'High-tech spiritual protection design.',
    image: 'https://picsum.photos/seed/shirt1/400/500',
    link: 'https://www.teepublic.com',
    platform: 'TeePublic'
  }
];

export const BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'The Unsealed Veil',
    subtitle: 'Decoding the Prophetic Frequency',
    description: 'A groundbreaking exploration of biblical mysteries and their modern applications.',
    image: 'https://picsum.photos/seed/book1/300/450',
    buyLink: 'https://amazon.com',
    platform: 'Amazon'
  }
];

export const PODCASTS: PodcastEpisode[] = [
  {
    id: 'p1',
    title: 'The Great Unsealing',
    description: 'Our first broadcast diving into the mechanism of theological tricks used in modern society.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070',
    episodeNumber: 1,
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    platform: 'YouTube'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    user: 'truth_seeker@gmail.com',
    text: 'This insight changed how I read the Bible!',
    status: 'approved',
    date: '2024-03-20'
  }
];

export const INITIAL_PAGES: Page[] = [
  {
    id: 'about',
    title: 'About Trick Theology',
    slug: 'about',
    featuredImage: 'https://picsum.photos/seed/about/800/1000',
    seoExcerpt: 'Trick Theology is more than just a brand; it\'s a digital sentinel standing at the crossroads of ancient wisdom and futuristic technology.',
    lastModified: new Date().toISOString(),
    content: `
      <h1>ABOUT TRICK THEOLOGY</h1>
      <p>Trick Theology is more than just a brand; it's a digital sentinel standing at the crossroads of ancient wisdom and futuristic technology. Our mission is to unseal the biblical secrets that have been hidden in plain sight for generations.</p>
      <p>Founded by a dedicated researcher, author, and truth-seeker, this platform serves as a hub for those who feel the pull of a deeper reality. We analyze prophecy, decode theological manipulations, and follow the biblical names and codes that structure our world.</p>
      <blockquote>"We live in an age of deception where theological 'tricks' are used to obscure the most profound truths of our existence. Trick Theology is here to provide the key."</blockquote>
      
      <h2>Core Principles</h2>
      <p>Our methodology focuses on strictly analytical biblical research. We strip away denominational bias to reveal the raw prophetic timeline as intended by the ancient scribes. This transition from "belief" to "evidence" is the core of our unsealed network.</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 4rem; border-top: 1px solid #1e293b; pt: 4rem;">
        <div style="text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1.5rem;">⚡</div>
          <h3 style="font-family: 'Orbitron', sans-serif; font-weight: 700; margin-bottom: 1rem;">THE MISSION</h3>
          <p style="font-size: 0.875rem; color: #64748b;">To empower the masses with biblical literacy and prophetic discernment in an increasingly complex digital landscape.</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1.5rem;">👁️</div>
          <h3 style="font-family: 'Orbitron', sans-serif; font-weight: 700; margin-bottom: 1rem;">THE VISION</h3>
          <p style="font-size: 0.875rem; color: #64748b;">A global community of enlightened individuals who see through theological illusions to the core of divine truth.</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1.5rem;">🛡️</div>
          <h3 style="font-family: 'Orbitron', sans-serif; font-weight: 700; margin-bottom: 1rem;">THE AUTHOR</h3>
          <p style="font-size: 0.875rem; color: #64748b;">A voice for the unsealed, bridging the gap between sacred scripture and modern geopolitics.</p>
        </div>
      </div>
    `
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    seoExcerpt: 'Our protocol for protecting your digital identity and neural data within the Trick Theology network.',
    lastModified: new Date().toISOString(),
    content: `
      <h1>Privacy Protocol</h1>
      <p>At Trick Theology, we value the sanctity of your digital presence. This policy outlines how your data is handled within our unsealed network.</p>
      
      <h2>1. Information Capture</h2>
      <p>We only collect data necessary for the authorized broadcast of theological insights. This includes your email address for identity verification and interaction logs for community engagement.</p>
      
      <h2>2. Data Encryption</h2>
      <p>Your "neural data"—your insights, comments, and interaction history—is treated with the highest level of encryption. We do not sell your data to third-party secular entities.</p>
      
      <h2>3. Communication Ciphers</h2>
      <p>By opting into our broadcast, you agree to receive periodic transmissions regarding biblical prophecy and world events. You can terminate this signal at any time via the "unsubscribe" node.</p>
      
      <h2>4. Security Logs</h2>
      <p>Our Command Center monitors for brute-force signatures to ensure the stability of the Veil. Failed login attempts are logged to prevent unauthorized entry into our sensitive archives.</p>
    `
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072',
    seoExcerpt: 'The authorized rules of engagement for interacting with the Trick Theology digital hub.',
    lastModified: new Date().toISOString(),
    content: `
      <h1>Authorized Terms of Engagement</h1>
      <p>By accessing the Trick Theology digital headquarters, you agree to the following protocols of engagement.</p>
      
      <h2>1. Intellectual Property</h2>
      <p>All scripts, manuscripts, and prophetic insights broadcast on this platform are the property of Trick Theology. Unauthorized mirroring of this data is prohibited.</p>
      
      <h2>2. Conduct Protocol</h2>
      <p>Users are expected to engage in theological exploration with respect and discernment. Any attempts to manipulate our network or distribute "theological tricks" designed to deceive will result in a terminal lockout.</p>
      
      <h2>3. Manuscript Distribution</h2>
      <p>Books and apparel acquired through our verified partners (Amazon, TeePublic, etc.) are subject to their respective fulfillment protocols. Trick Theology is the architect of the design; our partners are the fabricators of the physical artifacts.</p>
      
      <h2>4. Dynamic Evolution</h2>
      <p>These terms are subject to update as the global landscape shifts. Continued access to the Veil constitutes acceptance of these protocol changes.</p>
    `
  }
];
