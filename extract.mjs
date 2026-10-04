import fs from 'fs';
import { load } from 'cheerio'; // I hope cheerio is installed, or I'll just use regex

const html = fs.readFileSync('C:/Users/datta/.gemini/antigravity/brain/39b218f8-04d2-4e11-ab26-b9df84cd71a0/.system_generated/steps/87/content.md', 'utf8');

// Simple regex to extract text from tags
const texts = [];
const matches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
if (matches) {
  matches.forEach(m => console.log('Heading:', m.replace(/<[^>]+>/g, '')));
}

const buttons = html.match(/<a[^>]*class="[^"]*btn[^"]*"[^>]*>(.*?)<\/a>/gi) || html.match(/<button[^>]*>(.*?)<\/button>/gi);
if (buttons) {
  buttons.forEach(m => console.log('Button:', m.replace(/<[^>]+>/g, '')));
}

const images = html.match(/<img[^>]*src="([^"]+)"/gi);
if (images) {
  console.log('Images count:', images.length);
  images.slice(0, 5).forEach(m => console.log('Image:', m));
}
