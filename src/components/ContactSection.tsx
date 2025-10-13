'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitContactFormAction } from '@/app/actions';
import { SectionWrapper } from './SectionWrapper';
import { FadeIn } from './FadeIn';
import { CheckCircle2, Send, Mail } from 'lucide-react';
import { useState } from 'react';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export function ContactSection() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    const result = await submitContactFormAction(values);
    if (result.success) {
      setIsSuccess(true);
      toast({
        title: "Message Sent! ✨",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
      
      // Reset success state after animation
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please check your input and try again.",
      });
    }
  }
  
  return (
    <SectionWrapper id="contact">
      <FadeIn>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
            <span className="text-primary font-mono text-2xl">04.</span> Get In Touch
          </h2>
          <div className="w-full h-px bg-border"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side - Description */}
          <div className="space-y-6">
            <div>
              <h3 className="font-headline text-2xl font-bold mb-4">Let's Connect</h3>
              <p className="text-muted-foreground">
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open. I'll try my best to get back to you!
              </p>
            </div>
            
            <div className="pt-6 border-t border-border">
              <a 
                href="mailto:odai.dahi@hyperisland.se"
                className="inline-flex items-center gap-3 text-lg text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Mail className="h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <span className="group-hover:translate-x-1 transition-transform">odai.dahi@hyperisland.se</span>
              </a>
            </div>
          </div>

          {/* Right side - Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field} 
                          className="transition-all focus:scale-[1.02]"
                        />
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
                        <Input 
                          placeholder="your.email@example.com" 
                          {...field} 
                          className="transition-all focus:scale-[1.02]"
                        />
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
                        <Textarea 
                          placeholder="Your message..." 
                          {...field} 
                          className="transition-all focus:scale-[1.02] min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={form.formState.isSubmitting}
                  className="w-full group relative overflow-hidden"
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5 animate-in zoom-in duration-300" />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}