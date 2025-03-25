import { validateISBN, formatISBN } from '@/app/utils/generateBarcode';
import { NextResponse } from 'next/server';

// Handle POST requests for ISBN validation
export async function POST(request) {
  try {
    const body = await request.json();
    const { isbnData } = body;
    
    if (!isbnData) {
      return NextResponse.json(
        { message: 'ISBN data is required' },
        { status: 400 }
      );
    }

    // Just validate the ISBN - barcode will be generated client-side
    const cleanIsbn = validateISBN(isbnData);
    const formattedIsbn = formatISBN(cleanIsbn);
    
    // Generate a filename for download
    const filename = `ISBN-${cleanIsbn}.svg`;

    return NextResponse.json({
      success: true,
      filename,
      cleanIsbn,
      formattedIsbn
    });
  } catch (error) {
    console.error('Error validating ISBN:', error);
    return NextResponse.json(
      { message: error.message || 'Error validating ISBN' },
      { status: 500 }
    );
  }
} 