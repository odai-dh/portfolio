'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionWrapper } from '@/components/SectionWrapper';
import type { PortfolioData } from '@/lib/markdown';
import { Github, Linkedin, Twitter, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { submitContactFormAction } from '@/app/actions';
import { FadeIn } from './FadeIn';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ContactSectionProps = Pick<PortfolioData, 'email' | 'socials'>;

export function ContactSection({ email, socials }: ContactSectionProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ContactFormValues) {
    const result = await submitContactFormAction(data);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      // Handle server-side validation errors if necessary
      console.error("Submission failed:", result.errors);
    }
  }

  if (isSubmitted) {
    return (
        <SectionWrapper id="contact" className="bg-muted/30">
            <FadeIn>
                <div className="text-center py-16">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Thank You!</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Your message has been sent successfully. I'll get back to you soon.</p>
                </div>
            </FadeIn>
        </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="contact" className="bg-muted/30">
      <FadeIn>
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get In Touch</h2>
          <p className="mt-4 text-lg text-muted-foreground">Have a project in mind or just want to say hello? Drop me a line.</p>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-5">
          <div className="space-y-6 md:col-span-2">
            <h3 className="font-headline text-xl font-semibold">Contact Information</h3>
            <div className="space-y-4">
              <a href={`mailto:${email}`} className="flex items-center gap-4 transition-colors hover:text-primary">
                <Mail className="h-5 w-5" />
                <span>{email}</span>
              </a>
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 transition-colors hover:text-primary">
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 transition-colors hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Send me a message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="How can I help you?" className="min-h-[100px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
