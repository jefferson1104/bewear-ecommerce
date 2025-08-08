"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  email: z.email("Invalid email address").trim().min(1, "Email is required"),
  password: z.string().trim().min(6, "Invalid Password"),
});

type FormValues = z.infer<typeof formSchema>;

export const SignInForm = () => {
  // Hooks
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Methods
  const onSubmit = async (formData: FormValues) => {
    await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      fetchOptions: {
        onSuccess: () => {
          form.reset();
          toast.success("Signed in successfully!");
          router.push("/");
        },
        onError: (errorContext) => {
          console.error("SignIn Error:", errorContext);

          if (errorContext.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            toast.error("Invalid email or password. Please try again.");

            form.setError("email", {
              type: "manual",
              message: "Invalid email or password.",
            });

            form.setError("password", {
              type: "manual",
              message: "Invalid email or password.",
            });

            return;
          }

          toast.error(
            errorContext.error.message || "An error occurred while signing in.",
          );
        },
      },
    });
  };

  // Renders
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your account details to sign in.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="type your email"
                      {...field}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="type your password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Log In</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
