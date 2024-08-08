"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function SignInPage() {
  return (
    <AuroraBackground>
      <div className="flex min-h-[90dvh] w-11/12 z-[100]">
        <div
          className="rounded-l-2xl hidden bg-cover border-r-0 border border-x-zinc-800 lg:flex lg:w-1/2 lg:items-start lg:justify-center pt-10"
          style={{ backgroundImage: 'url("/concert.jpg")' }}
        >
          <div className="space-y-4 px-8 h-full mt-[400px]">
            <div>
              <div className="font-melodrama text-7xl font-bold text-zinc-100 text-center">
                SYMPHONY
              </div>
              <div className="font-melodrama text-5xl font-bold text-zinc-100 text-center">
                CONNECT
              </div>
            </div>
            <p className="text-neutral-200 font-agrandir text-center self-end">
              Connect with fellow music enthusiasts and discover new artists.{" "}
              <br /> Sign In Now.
            </p>
          </div>
        </div>
        <div className="rounded-r-2xl flex flex-col w-full items-center justify-center bg-black/40 backdrop-blur-xl lg:w-1/2 font-agrandir">
          <SignIn.Root>
            <Clerk.Loading>
              {(isGlobalLoading) => (
                <>
                  <SignIn.Step name="start">
                    <Card className="w-full sm:w-96">
                      <CardHeader>
                        <CardTitle>Sign in</CardTitle>
                        <CardDescription>
                          Welcome back! Please sign in to continue
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-y-4">
                        <div className="grid grid-cols-2 gap-x-4">
                          <Clerk.Connection name="microsoft" asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              disabled={isGlobalLoading}
                            >
                              <Clerk.Loading scope="provider:microsoft">
                                {(isLoading) =>
                                  isLoading ? "Loading..." : <>Microsoft</>
                                }
                              </Clerk.Loading>
                            </Button>
                          </Clerk.Connection>
                          <Clerk.Connection name="google" asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              disabled={isGlobalLoading}
                            >
                              <Clerk.Loading scope="provider:google">
                                {(isLoading) =>
                                  isLoading ? "Loading..." : <>Google</>
                                }
                              </Clerk.Loading>
                            </Button>
                          </Clerk.Connection>
                        </div>
                        <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                          or
                        </p>
                        <Clerk.Field name="identifier" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>Email address</Label>
                          </Clerk.Label>
                          <Clerk.Input type="email" required asChild>
                            <Input />
                          </Clerk.Input>
                          <Clerk.FieldError className="block text-sm text-destructive" />
                        </Clerk.Field>
                      </CardContent>
                      <CardFooter>
                        <div className="grid w-full gap-y-4">
                          <SignIn.Action submit asChild>
                            <Button disabled={isGlobalLoading}>
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? "Loading..." : "Continue";
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>

                          <Button variant="link" size="sm" asChild>
                            <Link href="/sign-up">
                              Don&apos;t have an account? Sign up
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </SignIn.Step>

                  <SignIn.Step name="choose-strategy">
                    <Card className="w-full sm:w-96">
                      <CardHeader>
                        <CardTitle>Use another method</CardTitle>
                        <CardDescription>
                          Facing issues? You can use any of these methods to
                          sign in.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-y-4">
                        <SignIn.SupportedStrategy name="email_code" asChild>
                          <Button
                            type="button"
                            variant="link"
                            disabled={isGlobalLoading}
                          >
                            Email code
                          </Button>
                        </SignIn.SupportedStrategy>
                        <SignIn.SupportedStrategy name="password" asChild>
                          <Button
                            type="button"
                            variant="link"
                            disabled={isGlobalLoading}
                          >
                            Password
                          </Button>
                        </SignIn.SupportedStrategy>
                      </CardContent>
                      <CardFooter>
                        <div className="grid w-full gap-y-4">
                          <SignIn.Action navigate="previous" asChild>
                            <Button disabled={isGlobalLoading}>
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? "Loading..." : "Go back";
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>
                        </div>
                      </CardFooter>
                    </Card>
                  </SignIn.Step>

                  <SignIn.Step name="verifications">
                    <SignIn.Strategy name="password">
                      <Card className="w-full sm:w-96">
                        <CardHeader>
                          <CardTitle>Welcome back</CardTitle>
                          <CardDescription>
                            Please enter your password to continue,{" "}
                            <SignIn.SafeIdentifier />
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-y-4">
                          <Clerk.Field name="password" className="space-y-2">
                            <Clerk.Label asChild>
                              <Label>Password</Label>
                            </Clerk.Label>
                            <Clerk.Input type="password" asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>
                        </CardContent>
                        <CardFooter>
                          <div className="grid w-full gap-y-4">
                            <SignIn.Action submit asChild>
                              <Button disabled={isGlobalLoading}>
                                <Clerk.Loading>
                                  {(isLoading) => {
                                    return isLoading
                                      ? "Loading..."
                                      : "Continue";
                                  }}
                                </Clerk.Loading>
                              </Button>
                            </SignIn.Action>
                          </div>
                        </CardFooter>
                      </Card>
                    </SignIn.Strategy>
                  </SignIn.Step>
                </>
              )}
            </Clerk.Loading>
          </SignIn.Root>
        </div>
      </div>
    </AuroraBackground>
  );
}
