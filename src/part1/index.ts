import { Database } from "./Database";

interface Book {
  name: string;
  author: string;
}

const db = new Database();

const bookCollection = db.createCollection<Book>('books', 'Book');

bookCollection.create([{
  name: '20,000 Leagues Under the Sea',
  author: 'Jules Verne',
}, {
  name: 'Journey to the Center of the Earth',
  author: 'Jules Verne',
}, {
  name: 'Frankenstein',
  author: 'Jules Verne',
}, {
  name: 'The Time Machine',
  author: 'H. G. Wells',
}]);

bookCollection.update({ _id: '2' }, { author: 'Mary Shelly' });
console.log(bookCollection.read({ _id: '2' }));

console.log(bookCollection.read({ author: 'Jules Verne' }));

bookCollection.delete({ _id: '0' });
console.log(bookCollection.read({ author: 'Jules Verne' }));
