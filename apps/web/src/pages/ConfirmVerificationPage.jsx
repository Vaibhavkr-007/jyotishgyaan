import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export default function ConfirmVerificationPage() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');

  useEffect(() => {

    const verifyEmail = async () => {

      try {

        await pb
          .collection('users')
          .confirmVerification(token);

        setStatus('success');

        setTimeout(() => {

          navigate('/login');

        }, 3000);

      } catch (error) {

        console.error(error);

        setStatus('error');

      }

    };

    verifyEmail();

  }, [token, navigate]);

  return (

    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="auth-form-card max-w-md w-full p-8 text-center">

        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />

            <h1 className="text-2xl font-bold mb-2">
              Verifying Email
            </h1>

            <p className="text-muted-foreground">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />

            <h1 className="text-2xl font-bold mb-2">
              Email Verified
            </h1>

            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified.
            </p>

            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>

            <Link
              to="/login"
              className="inline-block mt-4 text-primary font-semibold"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />

            <h1 className="text-2xl font-bold mb-2">
              Verification Failed
            </h1>

            <p className="text-muted-foreground mb-6">
              This verification link is invalid or has expired.
            </p>

            <Link
              to="/login"
              className="inline-block text-primary font-semibold"
            >
              Back to Login
            </Link>
          </>
        )}

      </div>

    </div>

  );

}