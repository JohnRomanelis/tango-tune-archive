import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
      } else if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        navigate("/login");
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Check your email for the password recovery link",
        });
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      } else if (event === 'SIGNED_UP') {
        toast({
          title: "Account Created",
          description: "Please check your email to confirm your account",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-tango-darkGray flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-tango-red mb-2">TandaBase</h1>
          <p className="text-tango-light">Organize your tango music collection</p>
        </div>
        
        <div className="bg-tango-gray p-8 rounded-lg shadow-xl">
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
            onError={(error) => {
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;