import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface LessonData {
  id: string;
  title: string;
  sections: string[];
}

const URLs = [
  'https://portal.e-lfh.org.uk/Component/Details/475153',
  'https://portal.e-lfh.org.uk/Component/Details/475156',
  'https://portal.e-lfh.org.uk/Component/Details/475159',
  'https://portal.e-lfh.org.uk/Component/Details/475162',
  'https://portal.e-lfh.org.uk/Component/Details/475165',
  'https://portal.e-lfh.org.uk/Component/Details/475168',
  'https://portal.e-lfh.org.uk/Component/Details/475171',
  'https://portal.e-lfh.org.uk/Component/Details/475174',
  'https://portal.e-lfh.org.uk/Component/Details/475177',
  'https://portal.e-lfh.org.uk/Component/Details/475180',
  'https://portal.e-lfh.org.uk/Component/Details/475737',
  'https://portal.e-lfh.org.uk/Component/Details/475183',
  'https://portal.e-lfh.org.uk/Component/Details/475186',
  'https://portal.e-lfh.org.uk/Component/Details/475189',
  'https://portal.e-lfh.org.uk/Component/Details/475192',
  'https://portal.e-lfh.org.uk/Component/Details/475195',
  'https://portal.e-lfh.org.uk/Component/Details/475476',
  'https://portal.e-lfh.org.uk/Component/Details/475198',
  'https://portal.e-lfh.org.uk/Component/Details/475201'
];

async function scrapeHeadings(url: string, index: number): Promise<LessonData | null> {
  try {
    console.log(`Scraping ${index + 1}/19: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract session title (h1)
    const title = $('h1').first().text().trim() || `Abdominal Ultrasound Session ${index + 1}`;
    
    // Extract section headings (h2, h3) from main content area
    const sections: string[] = [];
    
    // Try different selectors for content area
    const contentSelectors = [
      '.entry-content h2, .entry-content h3',
      '.content h2, .content h3',
      '.main-content h2, .main-content h3',
      'article h2, article h3',
      '.post-content h2, .post-content h3',
      'h2, h3' // fallback to all h2/h3
    ];
    
    for (const selector of contentSelectors) {
      $(selector).each((_, element) => {
        const headingText = $(element).text().trim();
        if (headingText && headingText.length > 0 && !sections.includes(headingText)) {
          sections.push(headingText);
        }
      });
      
      if (sections.length > 0) break; // Use first selector that finds headings
    }
    
    // Generate lesson ID
    const lessonId = `16_${String(index + 1).padStart(2, '0')}`;
    
    console.log(`  Found: "${title}" with ${sections.length} sections`);
    
    return {
      id: lessonId,
      title,
      sections
    };
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

async function main() {
  console.log('Starting e-LfH Abdominal Ultrasound headings scrape...');
  console.log(`Processing ${URLs.length} URLs`);
  
  const lessons: LessonData[] = [];
  
  // Process URLs sequentially to avoid overwhelming the server
  for (let i = 0; i < URLs.length; i++) {
    const lessonData = await scrapeHeadings(URLs[i], i);
    if (lessonData) {
      lessons.push(lessonData);
    }
    
    // Small delay between requests
    if (i < URLs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Write results to JSON file
  const outputPath = join(process.cwd(), 'data', 'us_abdo_lessons.json');
  writeFileSync(outputPath, JSON.stringify(lessons, null, 2));
  
  console.log(`\nScraping complete!`);
  console.log(`Found ${lessons.length} lessons`);
  console.log(`Output written to: ${outputPath}`);
  
  // Log summary
  lessons.forEach((lesson, index) => {
    console.log(`${index + 1}. ${lesson.title} (${lesson.sections.length} sections)`);
  });
}

// Run if this file is executed directly
main().catch(console.error);