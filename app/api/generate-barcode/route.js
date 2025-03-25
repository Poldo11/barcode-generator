import { generateISBNBarcode, formatISBN } from '@/app/utils/generateBarcode';
import { NextResponse } from 'next/server';
  
// Handle POST requests
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

    // Generate the ISBN barcode
    const { base64Image, filename, cleanIsbn } = await generateISBNBarcode(isbnData);

    // Format ISBN for display
    const formattedIsbn = formatISBN(cleanIsbn);

    return NextResponse.json({
      success: true,
      filename: filename,
      imageData: base64Image,
      formattedIsbn: formattedIsbn
    });
  } catch (error) {
    console.error('Error generating ISBN barcode:', error);
    return NextResponse.json(
      { message: error.message || 'Error generating ISBN barcode' },
      { status: 500 }
    );
  }
} 