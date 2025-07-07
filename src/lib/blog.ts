import { remark } from 'remark';
import html from 'remark-html';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: Record<string, BlogPost> = {
  'welcome-and-thanks-for-stopping-by': {
    slug: 'welcome-and-thanks-for-stopping-by',
    title: 'Welcome, and Thanks for Stopping By!',
    excerpt: 'I’m Scott Van Gilder, a DevOps consultant at AWS. I grew up in small-town Iowa, studied engineering at Iowa State, and discovered my passion for coding. Now I live in Superior, Colorado, with my wife and son, enjoying running, biking, and hiking. This blog shares my journey, tech insights, and life out west. Thanks for reading!',
    content: `
# Welcome, and Thanks for Stopping By!

## $whoami - Who Am I?

I’m Scott Van Gilder, and I grew up in Jefferson, a small town in Iowa with good roots, great parents, and a wonderful community I’m proud to call home. Jefferson was the kind of place where everyone knew—or at least knew of—everyone else. As a kid, I could ride my single-speed bicycle from one end of town to the other in under ten minutes.

After graduating high school, I left Jefferson to study engineering at Iowa State University in Ames, Iowa. While I enjoyed the challenges of engineering, I ultimately discovered that my true passion lay in programming. I graduated from Iowa State with a Bachelor of Science in Mechanical Engineering, then moved to Boulder, Colorado. There, I found the Galvanize Web Development Immersive program, which helped me build on my basic coding skills and learn industry best practices in software engineering and cloud development.

Today, I work as a Professional Services consultant for Amazon Web Services (AWS). I help customers achieve their business goals by delivering tailored DevOps solutions and cloud architectures. It gives me immense pride to know I’m contributing to some of the largest projects in the world and delivering high-quality results at an incredible scale.

These days, I live in Superior, Colorado, with my wonderful wife and son. Outside of work, you’ll often find me enjoying all the typical Colorado outdoor activities—running, biking, hiking, and generally soaking up the sunshine and mountain air.

Thanks again for stopping by my blog. I’m excited to share more about my journey, insights, and the things I’m passionate about. Stay tuned!
    `,
    date: '2025-07-06',
    readTime: '3 min read',
    tags: ['Origin', 'Iowan Roots', 'Colorado Resident', 'Engineering']
  },
};

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getAllPosts(): BlogPost[] {
  return Object.values(blogPosts).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  return blogPosts[slug] || null;
}