import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Simpan data baru
export const saveWeight = async (date, sheep, weight, feed) => {
  await addDoc(collection(db, 'weights'), {
    date,
    sheep,
    weight,
    feed,
  });
};

// Ambil semua data
export const getAllWeights = async () => {
  const snapshot = await getDocs(collection(db, 'weights'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update data
export const updateWeight = async (id, newData) => {
  const ref = doc(db, 'weights', id);
  await updateDoc(ref, newData);
};

// Hapus data
export const deleteWeight = async (id) => {
  const ref = doc(db, 'weights', id);
  await deleteDoc(ref);
};

// Ambil data terurut berdasarkan tanggal (untuk analisis tren)
export const getWeightsSorted = async () => {
  const data = await getAllWeights();
  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
};
