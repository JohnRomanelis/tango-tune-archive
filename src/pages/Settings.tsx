import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          setNewUsername(profile.username);
        }
        setUser(authUser);
      }
    };

    loadUserProfile();
  }, []);

  const handleUsernameUpdate = async () => {
    if (newUsername === username) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', newUsername)
      .single();

    if (existingUser) {
      setError("This username is already taken");
      setIsLoading(false);
      return;
    }

    // Update username
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', user.id);

    setIsLoading(false);

    if (updateError) {
      setError("Failed to update username");
      return;
    }

    setUsername(newUsername);
    toast({
      title: "Success",
      description: "Username has been updated",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-tango-light mb-8">Account Settings</h1>
      
      <div className="space-y-6 bg-tango-gray rounded-lg p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-tango-darkGray text-tango-light"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="space-y-2">
            <Input
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="bg-tango-darkGray text-tango-light"
              placeholder="Enter new username"
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Button
          onClick={handleUsernameUpdate}
          disabled={isLoading || newUsername === username}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Username"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;