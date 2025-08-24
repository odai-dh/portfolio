"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface WebsitePreviewProps {
  url: string;
  title: string;
  imageUrl: string;
}

export function WebsitePreview({ url, title, imageUrl }: WebsitePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(true); // Changed to true to load automatically
  const [iframeError, setIframeError] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const refreshIframe = () => {
    setIsLoading(true);
    setIframeError(false);
    setShowIframe(false);
    setTimeout(() => setShowIframe(true), 100);
  };
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIframeError(true);
    setIsLoading(false);
  };
  
  // Add an error handling timeout - if iframe doesn't load in 10 seconds, show error
  useEffect(() => {
    if (showIframe) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setIframeError(true);
          setIsLoading(false);
        }
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showIframe, isLoading]);
  
  return (
    <Card className={`overflow-hidden border rounded-lg transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : 'relative mb-8'}`}>
      <div className="flex items-center justify-between bg-secondary/30 p-2 border-b">
        <div className="flex items-center">
          <div className="flex space-x-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm font-mono truncate max-w-[200px] md:max-w-md">{url}</div>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={refreshIframe}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleExpand}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="sr-only">{isExpanded ? 'Minimize' : 'Expand'}</span>
          </Button>
        </div>
      </div>
      
      <CardContent className={`p-0 ${isExpanded ? 'h-[calc(100%-40px)]' : 'h-[400px] md:h-[500px]'} relative`}>
        {/* Loading state overlay */}
        {isLoading && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/30 z-10">
            <Image 
              src={imageUrl} 
              alt={title} 
              width={1200} 
              height={630}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute bg-background/80 p-4 rounded-lg shadow-lg">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-center">Loading preview...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {iframeError && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/30 z-10">
            <Image 
              src={imageUrl} 
              alt={title} 
              width={1200} 
              height={630}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute bg-background/80 p-4 rounded-lg shadow-lg max-w-md">
              <p className="text-sm text-center mb-3">This website cannot be displayed in an iframe.</p>
              <div className="flex justify-center">
                <Button onClick={refreshIframe} variant="outline" size="sm" className="mr-2">
                  Try Again
                </Button>
                <Button asChild size="sm">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* The actual iframe - always in the DOM but might be hidden */}
        {showIframe && (
          <iframe 
            src={url} 
            title={`${title} preview`}
            className={`w-full h-full border-0 ${isLoading || iframeError ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
        )}
      </CardContent>
    </Card>
  );
}