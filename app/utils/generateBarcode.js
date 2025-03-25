import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';
import { v4 as uuidv4 } from 'uuid';

export async function generateISBNBarcode(isbnData) {
  // Remove hyphens and spaces from ISBN
  const cleanIsbn = isbnData.replace(/[-\s]/g, '');
  
  // Validate ISBN format (must start with 978 and be 13 digits)
  if (!/^978\d{10}$/.test(cleanIsbn)) {
    throw new Error('ISBN must start with 978 and contain 13 digits in total');
  }

  // Define high-resolution dimensions (300 DPI)
  // For a 4-inch wide barcode: 4 inches * 300 DPI = 1200 pixels width
  const width = 1200;
  const height = 400;
  
  // Create a canvas element with high resolution
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Set higher quality settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Generate the barcode using EAN13 format (ISBN-13 uses EAN13 encoding)
  JsBarcode(canvas, cleanIsbn, {
    format: 'EAN13',
    width: 4,             // Increased from 3 for better quality
    height: height - 40,  // Increased height of barcode
    displayValue: false,  // Hide the ISBN number in the image
    fontSize: 40,         // Larger font size (not used when displayValue is false)
    textMargin: 15,       // Margin between barcode and text
    margin: 40,           // Increased margin around the barcode for better print quality
    background: '#FFFFFF', // Set explicit white background to ensure consistency
    lineColor: '#000000'  // Pure black for better contrast
  });

  // Apply additional rendering optimizations
  ctx.antialias = 'subpixel';
  
  // Convert the canvas to a base64 string, with max quality
  const base64Image = canvas.toDataURL('image/png', 1.0);
  
  // Generate a filename
  const filename = `ISBN-${cleanIsbn}-300dpi.png`;

  return { base64Image, filename, cleanIsbn };
}

// Format ISBN with proper hyphenation (978-xxxx-xxxx-xx-x)
export function formatISBN(isbn) {
  const cleanIsbn = isbn.replace(/[-\s]/g, '');
  
  if (cleanIsbn.length !== 13) {
    return cleanIsbn;
  }
  
  // Check if it's a Brazilian ISBN (starting with 978-65)
  if (cleanIsbn.startsWith('97865')) {
    // Brazilian ISBN format: 978-65-xxxxx-xx-x
    return `${cleanIsbn.slice(0, 3)}-${cleanIsbn.slice(3, 5)}-${cleanIsbn.slice(5, 10)}-${cleanIsbn.slice(10, 12)}-${cleanIsbn.slice(12)}`;
  }
  
  // Default international ISBN format
  return `${cleanIsbn.slice(0, 3)}-${cleanIsbn.slice(3, 7)}-${cleanIsbn.slice(7, 11)}-${cleanIsbn.slice(11, 12)}-${cleanIsbn.slice(12)}`;
}
