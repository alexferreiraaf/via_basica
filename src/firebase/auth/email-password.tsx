'use client';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


/** Initiate email/password sign-up (non-blocking) and create user document. */
export function initiateEmailSignUp(
  authInstance: Auth,
  firestoreInstance: Firestore,
  email: string,
  password: string
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
      // User created in Auth, now create their document in Firestore.
      const user = userCredential.user;
      const userDocRef = doc(firestoreInstance, 'users', user.uid);
      const newUserDoc = {
        id: user.uid,
        email: user.email,
        isAdmin: false, // Default role
      };

      // Non-blocking write to Firestore
      setDoc(userDocRef, newUserDoc)
        .catch((error) => {
          console.error("Error creating user document:", error);
          // Even if doc creation fails, the auth user was still created.
          // You might want to handle this case, e.g., by trying to delete the auth user.
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
      // Handle Auth creation errors (e.g., email already in use)
      console.error("Error during sign-up:", error);
      // You could emit a different kind of global error here for the UI
    });
}

/** Initiate email/password sign-in. Returns a promise that resolves on success or rejects with an error. */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(authInstance, email, password);
}
