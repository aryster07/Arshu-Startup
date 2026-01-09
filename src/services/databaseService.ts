// Firebase Database Service
// Supports both Firestore (document DB) and Realtime Database

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore';

import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  onValue,
  off,
  DatabaseReference,
} from 'firebase/database';

import { db, realtimeDb } from '../config/firebase';

// ============================================
// Firestore Operations (Document Database)
// ============================================

/**
 * Get a single document by ID
 */
export const getDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

/**
 * Get all documents from a collection
 */
export const getCollection = async <T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
};

/**
 * Add a new document to a collection
 */
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<DocumentReference> => {
  const collectionRef = collection(db, collectionName);
  return addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Set/create a document with a specific ID
 */
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T,
  merge: boolean = false
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  return setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
    ...(merge ? {} : { createdAt: serverTimestamp() }),
  }, { merge });
};

/**
 * Update an existing document
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  return deleteDoc(docRef);
};

/**
 * Subscribe to document changes (real-time)
 */
export const subscribeToDocument = <T>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null) => void
): (() => void) => {
  const docRef = doc(db, collectionName, documentId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
};

/**
 * Subscribe to collection changes (real-time)
 */
export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void,
  ...queryConstraints: QueryConstraint[]
): (() => void) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queryConstraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
    callback(data);
  });
};

// ============================================
// Realtime Database Operations
// ============================================

/**
 * Get data from Realtime Database
 */
export const getRealtimeData = async <T>(path: string): Promise<T | null> => {
  if (!realtimeDb) {
    console.warn('Realtime Database not configured');
    return null;
  }
  const dataRef = ref(realtimeDb, path);
  const snapshot = await get(dataRef);
  
  if (snapshot.exists()) {
    return snapshot.val() as T;
  }
  return null;
};

/**
 * Set data in Realtime Database
 */
export const setRealtimeData = async <T>(path: string, data: T): Promise<void> => {
  if (!realtimeDb) {
    console.warn('Realtime Database not configured');
    return;
  }
  const dataRef = ref(realtimeDb, path);
  return set(dataRef, data);
};

/**
 * Update data in Realtime Database
 */
export const updateRealtimeData = async <T extends object>(
  path: string,
  data: Partial<T>
): Promise<void> => {
  if (!realtimeDb) {
    console.warn('Realtime Database not configured');
    return;
  }
  const dataRef = ref(realtimeDb, path);
  return update(dataRef, data);
};

/**
 * Push new data to Realtime Database (auto-generated key)
 */
export const pushRealtimeData = async <T>(
  path: string,
  data: T
): Promise<DatabaseReference | null> => {
  if (!realtimeDb) {
    console.warn('Realtime Database not configured');
    return null;
  }
  const listRef = ref(realtimeDb, path);
  const newRef = push(listRef);
  await set(newRef, data);
  return newRef;
};

/**
 * Remove data from Realtime Database
 */
export const removeRealtimeData = async (path: string): Promise<void> => {
  if (!realtimeDb) {
    console.warn('Realtime Database not configured');
    return;
  }
  const dataRef = ref(realtimeDb, path);
  return remove(dataRef);
};

/**
 * Subscribe to Realtime Database changes
 */
export const subscribeToRealtimeData = <T>(
  path: string,
  callback: (data: T | null) => void
): (() => void) => {
  if (!realtimeDb) {
    console.warn('Realtime Database not configured');
    return () => {};
  }
  const dataRef = ref(realtimeDb, path);
  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as T);
    } else {
      callback(null);
    }
  });
  
  return () => off(dataRef);
};

// ============================================
// Query Helpers
// ============================================

export { where, orderBy, limit, Timestamp, serverTimestamp };
