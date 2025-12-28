'use client';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Firestore, doc, setDoc, getDocs, collection, query, limit } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


/** Initiate email/password sign-up (non-blocking) and create user document. */
export function initiateEmailSignUp(
  authInstance: Auth,
  firestoreInstance: Firestore,
  email: string,
  password: string
): void {
  // First, check if any user exists to determine if this is the first signup.
  const usersCollectionRef = collection(firestoreInstance, 'users');
  const q = query(usersCollectionRef, limit(1));

  // The logic to determine if a user is the first one is complex with strict security rules.
  // For now, we will create all users as non-admins. Admin promotion should be handled
  // through a secure backend process or manually in the Firebase Console.
  const isFirstUser = false; // Simplified for now to fix permissions

  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userDocRef = doc(firestoreInstance, 'users', user.uid);
      const newUserDoc = {
        id: user.uid,
        email: user.email,
        isAdmin: isFirstUser,
      };

      setDoc(userDocRef, newUserDoc)
        .catch((error) => {
          console.error("Error creating user document:", error);
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: newUserDoc,
            })
          );
        });
    })
    .catch((error) => {
      console.error("Error during sign-up:", error);
      // This should be handled in the UI form
    });
}


/** Initiate email/password sign-in. Returns a promise that resolves on success or rejects with an error. */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(authInstance, email, password);
}
