// Import modules
import { v4 as uuidv4 } from 'uuid';

// Function to format ISBN with proper hyphenation
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

// Function to validate ISBN format
export function validateISBN(isbn) {
  const cleanIsbn = isbn.replace(/[-\s]/g, '');
  
  if (!/^978\d{10}$/.test(cleanIsbn)) {
    throw new Error('ISBN must start with 978 and contain 13 digits in total');
  }
  
  return cleanIsbn;
}

// This helper function is used to generate the barcode SVG data in the client component
export function getBarcodeOptions(height = 100) {
  return {
    format: 'EAN13',
    width: 2,             // Bar width
    height: height,       // Bar height
    displayValue: false,  // Don't show text below barcode
    margin: 10,           // Margin around barcode
    background: '#FFFFFF',// White background
    lineColor: '#000000', // Black bars
    fontSize: 12,
    textMargin: 2
  };
}
