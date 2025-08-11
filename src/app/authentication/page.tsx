import { Header } from "@/components/commons/header";
import { SignInForm } from "@/components/sign-in-form";
import { SignUpForm } from "@/components/sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AuthenticationPage() {
  // Renders
  return (
    <>
      <Header />

      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Sign-In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign-Up</TabsTrigger>
          </TabsList>

          <TabsContent className="w-full" value="sign-in">
            <SignInForm />
          </TabsContent>

          {/* Sign Up Content */}
          <TabsContent className="w-full" value="sign-up">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
