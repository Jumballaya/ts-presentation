import { BongoDBClient } from "./client/index";

interface Book {
  author: string;
  title: string;
}

interface Album {
  artist: string;
  title: string;
}

const books: Book[] = [
  {
    author: 'Jules Verne',
    title: '20,000 Leagues Under the Sea',
  },
  {
    author: 'Jules Verne',
    title: 'Around the World in 80 Days'
  },
  {
    author: 'Jules Verne',
    title: 'Journey to the Center of the Earth'
  },
  {
    author: 'Mary Shelly',
    title: 'Frankenstein',
  },
  {
    author: 'H.G. Wells',
    title: 'The Time Machine',
  }
];

const albums = [
  {
    artist: 'Chet Baker',
    title: 'Chet Baker Sings',
  },
  {
    artist: 'Belle and Sebastian',
    title: 'Dear Catastrophe Waitress',
  },
  {
    artist: 'Peter, Paul and Mary',
    title: 'In the Wind'
  },
  {
    artist: 'Led Zeppelin',
    title: 'Led Zeppelin I',
  },
  {
    artist: 'Led Zeppelin',
    title: 'Led Zeppelin II',
  },
  {
    artist: 'Led Zeppelin',
    title: 'Led Zeppelin III',
  },
  {
    artist: 'Led Zeppelin',
    title: 'Led Zeppelin IV',
  },
  {
    artist: 'Led Zeppelin',
    title: 'Houses of the Holy',
  },
]

const handleBooks = async (client: BongoDBClient) => {
  const booksCollection = await client.getCollection<Book>('books', 'Book');
  await booksCollection.create(books);
  const resBooks = await booksCollection.read<Book>({ author: 'H.G. Wells' });
  console.log(resBooks);
}

const handleAlbums = async (client: BongoDBClient) => {
  const albumsCollection = await client.getCollection<Album>('albums', 'Album');
  await albumsCollection.create(albums);
  const resAlbums = await albumsCollection.read<Album>({ artist: 'Led Zeppelin' });
  console.log(resAlbums);
}


const main = async () => {
  const client = new BongoDBClient('bongodb://localhost:8080');

  await handleBooks(client);
  await handleAlbums(client);

  client.close();
}

main();
