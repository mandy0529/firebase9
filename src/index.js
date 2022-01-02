import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  orderBy,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

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

//query ref where
const toWhere = query(collectionRef, where('author', '==', 'minji'));

// query ref serverstamp
const when = query(collectionRef, orderBy('createdAt'));

// auth
const auth = getAuth();

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

// query로 잡아서 옵션 정하기  author가 minji인 book만 보여줘! 해주는 옵션 query or 오름차순으로 정렬해줘 ! collectionref=>where 아니면 따로 만들어준 when으로 넣어주기
// realtime으로 바로바로 업뎃시키기
onSnapshot(when, (doc) => {
  let books = [];
  doc.docs.map((item) => {
    books.push({...item.data(), id: item.id});
  });
  console.log(books, 'books');
});

//  single product fetch
const singleRef = doc(collectionRef, '2SlNZ2M6YGdyxfDMq5FG');
const fetchSingleProduct = () => {
  onSnapshot(singleRef, (doc) => {
    const data = doc.data();
  });
};
fetchSingleProduct();

//adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = await addDoc(collectionRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  });
  addBookForm.reset();
  console.log(value, 'value');
});

//deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const deletedRef = doc(db, 'books', deleteBookForm.id.value);
  await deleteDoc(deletedRef);
  deleteBookForm.reset();
});

//updating documents
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updateRef = doc(db, 'books', updateBookForm.id.value);
  await updateDoc(updateRef, {
    title: 'updated title!',
  });
  updateBookForm.reset();
});

// sign up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  try {
    const createSignUp = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(createSignUp.user, 'create sign up');
    signupForm.reset();
  } catch (error) {
    alert(error);
  }
});

//login
const loginForm = document.querySelector('.login');
const logoutBtn = document.querySelector('.logout');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  try {
    const login = await signInWithEmailAndPassword(auth, email, password);
    // console.log(login.user, 'login');
    logoutBtn.innerHTML = 'logout';
    loginForm.reset();
  } catch (error) {
    alert(error);
  }
});

//logout

logoutBtn.addEventListener('click', async (e) => {
  try {
    await signOut(auth);
    logoutBtn.innerHTML = 'login';
  } catch (error) {
    console.log(error, 'error');
  }
});

//subscribing to auth changes
onAuthStateChanged(auth, (user) => {
  console.log('user status changed', user);
});
