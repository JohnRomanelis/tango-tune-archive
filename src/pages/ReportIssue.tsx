import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
  typeId: z.string().min(1, "Please select an issue type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const ReportIssue = () => {
  const user = useAuthRedirect();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeId: "",
      description: "",
    },
  });

  const { data: issueTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["issueTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issue_type")
        .select("*")
        .order("id");
      if (error) throw error;
      return data;
    },
  });

  const submitIssueMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase.from("issue").insert({
        type_id: parseInt(values.typeId),
        description: values.description,
        user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your feedback!",
        description: "We'll review your submission and get back to you if needed.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error submitting issue",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error submitting issue:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitIssueMutation.mutate(values);
  };

  if (isLoadingTypes) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Help Us Improve TandaBase</h1>
      <p className="text-tango-light/80 mb-8">
        Your feedback helps us make TandaBase better for everyone. Let us know what's on your mind.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-tango-light">What kind of feedback do you have?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-tango-gray border-tango-gray text-tango-light">
                      <SelectValue placeholder="Select the type of feedback" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {issueTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-tango-light">Tell us more</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide as much detail as possible..."
                    className="bg-tango-gray border-tango-gray text-tango-light min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-tango-red hover:bg-tango-red/90"
            disabled={submitIssueMutation.isPending}
          >
            {submitIssueMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReportIssue;