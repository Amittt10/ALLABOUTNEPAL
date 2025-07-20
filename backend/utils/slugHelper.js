// utils/slugHelper.js
export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove non-word chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/--+/g, '-');     // Replace multiple - with single -
}
