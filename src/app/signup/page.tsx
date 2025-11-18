'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.355-11.297-7.962l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.25,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const auth = getAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const displayName = `${firstName} ${lastName}`.trim();
      await updateProfile(user, { displayName });

      if (firestore) {
        await setDoc(doc(firestore, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          displayName,
          photoURL: user.photoURL,
          themePreference: 'dark',
        });
      }

      toast({ title: 'Signup Successful' });
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (firestore) {
        await setDoc(
          doc(firestore, 'users', user.uid),
          {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            themePreference: 'dark',
          },
          { merge: true }
        );
      }

      toast({ title: 'Signup Successful' });
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: 'destructive',
        title: 'Google Signup Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/20 bg-background/50 p-8 shadow-2xl shadow-primary/10 backdrop-blur-lg">
            <div className="text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-3xl font-bold tracking-tighter text-foreground">
                Create Your Account
                </h1>
                <p className="mt-2 text-muted-foreground">
                Join the network and start your mission against deception.
                </p>
            </div>
            <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="bg-transparent"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="bg-transparent"
                    />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-transparent"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-transparent"
                />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create an account'}
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background/50 px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign up with Google
                </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </div>
    </div>
  );
}
