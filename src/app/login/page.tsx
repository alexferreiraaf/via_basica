'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/auth/email-password';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

const formSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async (data: UserFormValue) => {
    try {
      await initiateEmailSignIn(auth, data.email, data.password);
      // onAuthStateChanged will handle the redirect
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        form.setError('root', {
          type: 'manual',
          message: 'Email ou senha inválidos. Por favor, tente novamente.',
        });
      } else {
        form.setError('root', {
          type: 'manual',
          message: 'Ocorreu um erro. Tente novamente mais tarde.',
        });
        console.error("Sign-in error:", error);
      }
    }
  };

  const handleSignUp = (data: UserFormValue) => {
    // This part remains non-blocking as it involves multiple steps
    initiateEmailSignUp(auth, firestore, data.email, data.password);
  };

  return (
    <div className="flex items-center justify-center p-4 pt-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-2">
            <BookOpen size={28} />
          </div>
          <CardTitle className="font-headline text-2xl">
            Acesse sua Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
              {form.formState.errors.root && (
                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  <LogIn size={16} /> Entrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={form.handleSubmit(handleSignUp)}
                  disabled={form.formState.isSubmitting}
                >
                  Criar Conta
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
