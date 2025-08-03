import type { ContentItem } from "../types";

// Backend data structure (from ResumeBlock)
export interface ResumeBlock {
  id: string;
  title: string;
  company?: string;
  location?: string;
  dateRange?: string;
  technologies?: string; // String, not array
  link?: string;
  tags?: string[];
  lines?: string[]; // Array of strings, not bulletPoints
  projects?: unknown[];
  priority?: number;
}

// Utility function to parse bullets with link indicators
export function parseBulletsWithLinks(bullets: any[]): any[] {
  return bullets.map((bullet) => {
    // Check if bullet text contains link indicator
    if (bullet.bulletText && bullet.bulletText.includes("[LINK:")) {
      const linkMatch = bullet.bulletText.match(/\[LINK:\s*([^\]]+)\]/);
      if (linkMatch) {
        const link = linkMatch[1].trim();
        const textWithoutLink = bullet.bulletText
          .replace(/\[LINK:\s*[^\]]+\]/, "")
          .trim();
        return {
          ...bullet,
          bulletText: textWithoutLink,
          link: link,
        };
      }
    }
    return bullet;
  });
}

// Transform backend ResumeBlock to frontend ContentItem
export function transformResumeBlocksToContentItems(
  resumeBlocks: ResumeBlock[]
): ContentItem[] {
  return resumeBlocks.map((block) => ({
    id: block.id,
    type: block.company ? "experience" : "project",
    title: block.title,
    company: block.company || undefined,
    location: block.location || undefined,
    dateRange: block.dateRange || undefined,
    description:
      block.lines && block.lines.length > 0 ? "" : "No description available",
    bulletPoints: block.lines || [],
    technologies: block.technologies
      ? block.technologies.split(",").map((tech: string) => tech.trim())
      : [],
    link: block.link || undefined,
    category: block.company ? "Work Experience" : "Projects",
    tags: block.tags || [],
  }));
}

// Transform frontend ContentItem to backend ResumeBlock format
export function transformContentItemsToResumeBlocks(
  contentItems: ContentItem[]
): ResumeBlock[] {
  return contentItems.map((item) => ({
    id: item.id,
    title: item.title,
    company: item.company || undefined,
    location: item.location || undefined,
    dateRange: item.dateRange || undefined,
    technologies: item.technologies ? item.technologies.join(", ") : undefined,
    link: item.link || undefined,
    tags: item.tags || undefined,
    lines: item.bulletPoints || undefined,
    projects: undefined,
    priority: 0,
  }));
}
