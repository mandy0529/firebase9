import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD8WuI2siL9wROzTR5_c9ls5qpFgmw0W8Y',
  authDomain: 'fir-9-a19ab.firebaseapp.com',
  projectId: 'fir-9-a19ab',
  storageBucket: 'fir-9-a19ab.appspot.com',
  messagingSenderId: '186386072308',
  appId: '1:186386072308:web:e36adfa0c01fcc535814a1',
  measurementId: 'G-5QVVSWZJQ3',
};

initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const collectionRef = collection(db, 'books');

// get collection data ( 리얼타임 안한걸로 collection data 받아오기)
const getCollection = async () => {
  try {
    const doc = await getDocs(collectionRef);
    let books = [];
    doc.docs.map((item) => {
      books.push({...item.data(), id: item.id});
    });
    console.log(books, 'books');
  } catch (error) {
    console.log(error);
  }
};

// realtime으로 바로바로 업뎃시키기
onSnapshot(collectionRef, (doc) => {
  let books = [];
  doc.docs.map((item) => {
    books.push({...item.data(), id: item.id});
  });
  console.log(books, 'books');
});

//adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = await addDoc(collectionRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
  });
  addBookForm.reset();
  console.log(value, 'value');
});

//deleting decuments
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const deletedRef = doc(db, 'books', deleteBookForm.id.value);
  await deleteDoc(deletedRef);
  deleteBookForm.reset();
});
