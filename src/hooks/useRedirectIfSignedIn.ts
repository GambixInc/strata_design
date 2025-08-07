import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Redirects to the provided path if a valid auth session exists.
 * Intended for pages like `Login` and `SignUp` so authenticated users
 * are not presented with auth forms again.
 */
export function useRedirectIfSignedIn(redirectPath: string = '/'): void {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const session = await fetchAuthSession();
        if (!isMounted) return;
        if (session.tokens) {
          navigate(redirectPath, { replace: true });
        }
      } catch {
        // Not signed in or Auth not ready; ignore
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [navigate, redirectPath]);
}


