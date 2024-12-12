import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
          <div className="mb-4 text-sm text-tango-light">
            <p>Password requirements:</p>
            <ul className="list-disc ml-4 mt-1">
              <li>Minimum 6 characters long</li>
            </ul>
          </div>
          
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
            localization={{
              variables: {
                sign_up: {
                  password_too_short: "Password must be at least 6 characters long",
                  invalid_credentials: "Invalid email or password",
                },
                sign_in: {
                  invalid_credentials: "Invalid email or password",
                }
              }
            }}
            theme="dark"
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;