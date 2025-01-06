import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        navigate("/login");
      } else if (event === 'USER_UPDATED') {
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-tango-darkGray flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-tango-red mb-2">TandaBase</h1>
          <p className="text-tango-light">Organize your tango music collection</p>
        </div>
        
        <div className="bg-tango-gray p-8 rounded-lg shadow-xl">
          {showSignUp && (
            <div className="mb-4 text-sm text-tango-light">
              <p>Password requirements:</p>
              <ul className="list-disc ml-4 mt-1">
                <li>Minimum 6 characters long</li>
              </ul>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#D32F2F',
                    brandAccent: '#B71C1C',
                  },
                },
              },
            }}
            theme="dark"
            providers={[]}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={false}
            view={showSignUp ? 'sign_up' : 'sign_in'}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up ...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Don\'t have an account? Sign up',
                  confirmation_text: 'Check your email for the confirmation link',
                },
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in ...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;