import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Profile {
  username: string;
}

const Settings = () => {
  const { user, isLoading } = useAuthRedirect();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    getProfile();
  }, [user?.id]);

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-tango-light mb-8">Settings</h1>
      
      <Card className="bg-tango-gray border-tango-border">
        <CardHeader>
          <CardTitle className="text-tango-light">User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tango-light mb-1">
              Email
            </label>
            <p className="text-tango-light">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-tango-light mb-1">
              Username
            </label>
            <p className="text-tango-light">{profile?.username}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Settings;