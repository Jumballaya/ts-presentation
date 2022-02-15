import path from "path";
import { Database } from "./Database";

interface Book {
  name: string;
  author: string;
}

const main = async () => {

  const db = new Database(path.resolve(__dirname, '..', '..', '.data'));

  const bookCollection = await db.createCollection<Book>('books');
  console.log(bookCollection);

  await bookCollection.create([{
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

  await bookCollection.update({ _id: '2' }, { author: 'Mary Shelly' });
  console.log(await bookCollection.read({ _id: '2' }));

  console.log(await bookCollection.read({ author: 'Jules Verne' }));

  await bookCollection.delete({ _id: '0' });
  console.log(await bookCollection.read({ author: 'Jules Verne' }));
}


main();