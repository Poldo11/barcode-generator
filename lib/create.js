// First set using $input.first().json
const aboutPublish = $input.first().json['[OPCIONAL] Por que você quer publicar com a gente?'];
const aboutAuthor = $input.first().json["Conte um pouco sobre você. \n(Não tem receita pronta. Nossa sugestão é falar brevemente sobre sua trajetória pessoal, o que te motiva na literatura e o que te levou a escrever esse livro)"];
const shortAboutAuthor = $input.first().json["[OPCIONAL] Se você já tem uma minibio, envia ela aqui.\n\nExemplo:\n\nLara Haje é jornalista e mestre em Políticas de Comunicação pela Universidade de Brasília (UnB), trabalha como repórter na agência de notícias da Câmara dos Deputados. Co-autora do livro Paúra – um mergulho na síndrome do pânico (2018). Ficou em 5º lugar no Prêmio Off Flip 2023 na categoria crônica, com "Tijolos de isopor", e uma das 15 finalistas do III Prêmio Anna Maria Martins (2023), da União Brasileira de Escritores, com o conto "Merda, em árabe", além de uma das autoras classificadas do II Concurso Literário Philos Mulher 2024, com o conto "Como se sobrevive a uma coisa dessas". Eu não disse (Cachalote, 2024) é seu primeiro livro de ficção."]
const aboutBook = $input.first().json['Fale um pouco sobre o livro.\n(conceito, sinopse, proposta estética etc.)'];
const dateInput = $input.first().json['Carimbo de data/hora'];
const hasPublished = $input.first().json['Você já publicou algum livro?'];
const hasBought = $input.first().json['Já comprou algum livro da Cachalote ou da Aboio?'];
const bookGenre = $input.first().json['Qual é o gênero do seu original?'];
const publisherAnswer = $input.first().json['Recebeu alguma resposta?'];
const authorNameRaw = $input.first().json['Qual seu nome completo?'];
const authorEmail = $input.first().json['E-mail para contato (coloque um e-mail que você use com frequência, por favor)'];
const bookArchiveRaw = $input.first().json['Conferiu se o arquivo está certo e padronizado? Agora é só enviar por aqui.\nNão envie em PDF!'];
const bookTitleRaw = $input.first().json['Qual o título do seu original?'];
const authorBornInState = $input.first().json['Qual seu estado de nascença?'];
const authorWritesInState = $input.first().json['De qual estado você escreve?'];
const authorWritesInCity = $input.first().json['De que cidade você escreve?'];
const authorReferences = $input.first().json['Cite três referências literárias suas em língua portuguesa.\n(Essa é uma pergunta pra gente conhecer melhor seus gostos como leitor, seja sincero)'];

const authorReferences2 = $input.first().json['E quem você listaria como três referências estrangeiras?'];

const authorPronounRaw = $input.first().json['Qual seu Pronoune?'];


function formatPronoun(inputPronoun) {
  // Normalize input by trimming and converting to uppercase
  const normalizedInput = (inputPronoun || '').trim().toUpperCase();

  // Define mapping from form values to CRM format
  const pronounMapping = {
    'ELA/DELA': 'ELA_DELA',
    'ELE/DELE': 'ELE_DELE',
    'ELU/DELU': 'ELU_DELU', 
    'ELA/DELU': 'ELA_DELU',
    'ELE/DELU': 'ELE_DELU',
    'ELU, ILE, ELE': 'ELU_ILE_ELE',
    'VOCÊ': 'VOCE',
    'OUTRO': 'OUTRO',
    'PREFIRO NÃO INFORMAR': 'NAO_INFORMOU'
  };

  // Try exact match first
  if (pronounMapping[normalizedInput]) {
    return pronounMapping[normalizedInput];
  }

  // Try case-insensitive match
  const normalizedMapping = Object.keys(pronounMapping).reduce((acc, key) => {
    acc[key.toUpperCase()] = pronounMapping[key];
    return acc;
  }, {});

  return normalizedMapping[normalizedInput] || 'NAO_INFORMOU';
}

// Function to properly format Portuguese names
function formatName(name) {
  if (!name) return '';
  
  // Convert the entire name to lowercase first
  const lowercaseName = name.toLowerCase();
  
  // Split the name into words
  const words = lowercaseName.split(' ');
  
  // List of Portuguese articles/prepositions that should remain lowercase
  const lowercaseWords = ['de', 'da', 'do', 'das', 'dos', 'e'];
  
  // Capitalize each word except those in the lowercaseWords list
  const formattedWords = words.map((word, index) => {
    // Skip empty words
    if (word.trim() === '') return '';
    
    // Keep articles and prepositions lowercase unless they're the first word
    if (lowercaseWords.includes(word) && index !== 0) {
      return word;
    }
    
    // Capitalize the first letter of other words
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  // Join the words back together
  return formattedWords.join(' ');
}

// Format the author name and book title
const authorName = formatName(authorNameRaw);
const bookTitle = formatName(bookTitleRaw);
const authorPronoun = formatPronoun(authorPronounRaw)

// Use bookArchiveUrl parameter instead of bookArchiveRaw global variable
function expandBookArchive(bookArchiveUrl, authorName, title) {
  if (!bookArchiveUrl || typeof bookArchiveUrl !== 'string') {
    return { link: "", label: "No manuscript uploaded" };
  }
  
  // Create a label using authorName and book title
  const name = authorName ? authorName.trim() : "Unknown Author";
  const titleText = title ? title.trim() : "Unknown Title";
  const label = `${name} — ${titleText}`;
  
  return {
    link: bookArchiveUrl,
    label: label
  };
}

// Function to replace all double quotes with single quotes
function replaceQuotes(str) {
  if (str === undefined || str === null) {
    return '';
  }
  // Replace all types of double quotes (straight and curly) with single quotes
  return str.replace(/["""]/g, "'");
}

function replaceNewlinesWithSpaces(inputString) {
  if (inputString === undefined || inputString === null) {
    return '';
  }
  return inputString.replace(/\n/g, ' ');
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatDateToRFC3339(dateInput) {
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string' && dateInput.trim() !== '') {
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } else {
    date = new Date();
  }
  
  return date.toISOString().split('T')[0];
}

// Generate the UUID
const randomID = generateUUID();
const personRandomID = generateUUID();

// Generate a random integer for the position
const randomPosition = Math.floor(Math.random() * 1000) + 1;

// Process each input field with proper cleaning
// First replace newlines with spaces
const cleanedAboutPublish = replaceNewlinesWithSpaces(aboutPublish || '');
const cleanedAboutAuthor = replaceNewlinesWithSpaces(aboutAuthor || '');
const cleanedShortAboutAuthor = replaceNewlinesWithSpaces(shortAboutAuthor || '');
const cleanedAboutBook = replaceNewlinesWithSpaces(aboutBook || '');
const cleanedBookTitle = replaceNewlinesWithSpaces(bookTitle || '');
const cleanedAuthorBornInState = replaceNewlinesWithSpaces(authorBornInState || '');
const cleanedAuthorWritesInState = replaceNewlinesWithSpaces(authorWritesInState || '');
const cleanedAuthorWritesInCity = replaceNewlinesWithSpaces(authorWritesInCity || '');
const cleanedAuthorReferences = replaceNewlinesWithSpaces(authorReferences || '');
const cleanedAuthorReferences2 = replaceNewlinesWithSpaces(authorReferences2 || '');
const cleanedAuthorPronoun = replaceNewlinesWithSpaces(authorPronoun || '');

// Then replace any double quotes with single quotes
const quotesFixedAuthorReferences = replaceQuotes(cleanedAuthorReferences);
const quotesFixedAuthorBornInState = replaceQuotes(cleanedAuthorBornInState);
const quotesFixedAuthorWritesInState = replaceQuotes(cleanedAuthorWritesInState);
const quotesFixedAuthorWritesInCity = replaceQuotes(cleanedAuthorWritesInCity);
const quotesFixedAuthorReferences2 = replaceQuotes(cleanedAuthorReferences2);
const quotesFixedAuthorPronoun = replaceQuotes(cleanedAuthorPronoun);
const quotesFixedAboutPublish = replaceQuotes(cleanedAboutPublish);
const quotesFixedAboutAuthor = replaceQuotes(cleanedAboutAuthor);
const quotesFixedShortAboutAuthor = replaceQuotes(cleanedShortAboutAuthor);
const quotesFixedAboutBook = replaceQuotes(cleanedAboutBook);
const quotesFixedBookTitle = replaceQuotes(cleanedBookTitle);

// Make sure to properly escape any remaining special characters for JSON
function escapeForJson(str) {
  if (str === undefined || str === null) {
    return '';
  }
  return str.replace(/[\\"]/g, '\\$&');
}

const escapedAboutPublish = escapeForJson(quotesFixedAboutPublish);
const escapedAboutAuthor = escapeForJson(quotesFixedAboutAuthor);
const escapedShortAboutAuthor = escapeForJson(quotesFixedShortAboutAuthor);
const escapedAboutBook = escapeForJson(quotesFixedAboutBook);
const escapedhasPublished = escapeForJson(replaceQuotes(hasPublished || ''));
const escapedhasBought = escapeForJson(replaceQuotes(hasBought || ''));
const escapedbookGenre = escapeForJson(replaceQuotes(bookGenre || ''));
const escapedpublisherAnswer = escapeForJson(replaceQuotes(publisherAnswer || ''));
const escapedauthorName = escapeForJson(replaceQuotes(authorName || ''));
const escapedauthorEmail = escapeForJson(replaceQuotes(authorEmail || ''));
const escapedbookTitle = escapeForJson(quotesFixedBookTitle);
const escapedauthorReferences = escapeForJson(quotesFixedAuthorReferences);
const escapedauthorReferences2 = escapeForJson(quotesFixedAuthorReferences2);
const escapedauthorBornInState = escapeForJson(quotesFixedAuthorBornInState);
const escapedauthorWritesInState = escapeForJson(quotesFixedAuthorWritesInState);
const escapedauthorWritesInCity = escapeForJson(quotesFixedAuthorWritesInCity);
const escapedauthorPronoun = escapeForJson(quotesFixedAuthorPronoun);

// Split author name into first and last name
function splitAuthorName(fullName) {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const nameParts = fullName.trim().split(' ');
  if (nameParts.length === 0) return { firstName: '', lastName: '' };
  if (nameParts.length === 1) return { firstName: nameParts[0], lastName: '' };
  
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return { firstName, lastName };
}

const { firstName, lastName } = splitAuthorName(escapedauthorName);



// Use the bookArchiveRaw with proper fallback
const bookArchiveFinal = expandBookArchive(
  bookArchiveRaw || '', 
  authorName || '', 
  bookTitle || ''
);

const result = {
  ID: randomID,
  authorNameTwo: {
    firstName: firstName,
    lastName: lastName
  },
  personId: personRandomID,
  bookTitle: escapedbookTitle,
  bookArchive: bookArchiveFinal,
  position: randomPosition,
  aboutPublish: escapedAboutPublish,
  aboutAuthor: escapedAboutAuthor,
  shortAboutAuthor: escapedShortAboutAuthor,
  aboutBook: escapedAboutBook,
  formattedDate: formatDateToRFC3339(dateInput || new Date()),
  hasPublisher: escapedhasPublished,
  hasBought: escapedhasBought,
  genre: escapedbookGenre,
  publisherAnswer: escapedpublisherAnswer,
  authorName: escapedauthorName,
  authorEmail: escapedauthorEmail,
  authorReferences: escapedauthorReferences,
  authorReferences2: escapedauthorReferences2,
  authorBornInState: escapedauthorBornInState,
  authorWritesInState: escapedauthorWritesInState,
  authorWritesInCity: escapedauthorWritesInCity,
  authorPronoun: escapedauthorPronoun,
  
};

return result;