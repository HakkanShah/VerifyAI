
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import {
  FileImage,
  Link as LinkIcon,
  Loader2,
  Share2,
  Type,
  UploadCloud,
  X,
  BotMessageSquare,
  BadgeCheck,
  BadgeAlert,
  BadgeHelp,
  Volume2,
  LogIn,
  Construction,
  BookText,
  Lightbulb,
  Quote,
} from 'lucide-react';
import { verifyTextAction, verifyImageAction, getSpeechAction } from '@/app/actions';
import type { TextCredibilityAnalysisOutput } from '@/ai/flows/text-credibility-analyzer';
import type { AnalyzeImageDeepfakeOutput } from '@/ai/flows/image-deepfake-analyzer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const initialTextState: {
  data: TextCredibilityAnalysisOutput | null;
  error: string | null;
  zodErrors?: { text?: string[] } | null;
} = {
  data: null,
  error: null,
  zodErrors: null,
};

const initialImageState: {
  data: AnalyzeImageDeepfakeOutput | null;
  error: string | null;
} = {
  data: null,
  error: null,
};

type AnalysisResult =
  | (TextCredibilityAnalysisOutput & { type: 'text'; input: string })
  | (AnalyzeImageDeepfakeOutput & { type: 'image'; input: string });

const getResultTitle = (result: AnalysisResult) => {
  switch (result.type) {
    case 'text':
      return 'Text Credibility Report';
    case 'image':
      return 'Image Deepfake Report';
  }
};

const getScore = (result: AnalysisResult): number => {
  switch (result.type) {
    case 'text':
      return result.credibilityScore * 100;
    case 'image':
      return result.isDeepfake
        ? (1 - result.confidenceScore) * 100
        : result.confidenceScore * 100;
  }
};

const getSummaryText = (
  result: AnalysisResult,
  score: number,
  scoreLabel: string
): string => {
  switch (result.type) {
    case 'text':
      return `This text has an authenticity score of ${Math.round(
        score
      )}%, and is considered ${scoreLabel}. Summary: ${result.factCheckSummary}`;
    case 'image':
      return `This image has an authenticity score of ${Math.round(
        score
      )}%, and is considered ${scoreLabel}. Analysis: ${result.explanation}`;
  }
};

const ResultDisplay = ({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) => {
  const score = getScore(result);
  const scoreLabel =
    score > 75
      ? 'Likely Authentic'
      : score > 40
      ? 'Potentially Deceptive'
      : 'Likely Deceptive';
  const scoreColor =
    score > 75
      ? 'hsl(var(--primary))'
      : score > 40
      ? 'hsl(var(--accent))'
      : 'hsl(var(--destructive))';

  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  useEffect(() => {
    if (firestore && user) {
      let collectionName: string;
      let dataToSave: any;

      switch (result.type) {
        case 'text':
          collectionName = 'textVerifications';
          dataToSave = {
            inputText: result.input,
            credibilityScore: result.credibilityScore,
            factCheckSummary: result.factCheckSummary,
            suspiciousPhrases: result.manipulatedPhrases.join(', '),
            relatedArticles: JSON.stringify(result.relatedArticles),
          };
          break;
        case 'image':
          collectionName = 'imageVerifications';
          dataToSave = {
            imageUrl: result.input, // Save the data URI of the image
            deepfakeProbability: result.isDeepfake
              ? result.confidenceScore
              : 1 - result.confidenceScore,
            manipulationsDetected: result.explanation,
            relatedArticles: JSON.stringify(result.relatedArticles),
          };
          break;
        default:
          return;
      }

      const verificationsCol = collection(
        firestore,
        'users',
        user.uid,
        collectionName
      );
      addDoc(verificationsCol, {
        ...dataToSave,
        timestamp: serverTimestamp(),
        userId: user.uid,
      }).catch(console.error);
    }
  }, [result, firestore, user]);

  const getIcon = (className = 'h-5 w-5') => {
    if (score > 75)
      return <BadgeCheck className={cn(className, 'text-green-400')} />;
    if (score > 40)
      return <BadgeHelp className={cn(className, 'text-yellow-400')} />;
    return <BadgeAlert className={cn(className, 'text-red-400')} />;
  };
  
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast({
        variant: 'destructive',
        title: 'Speech Not Supported',
        description: 'Your browser does not support the Web Speech API.',
      });
      return;
    }
  
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
  
    const summaryText = getSummaryText(result, score, scoreLabel);
    const utterance = new SpeechSynthesisUtterance(summaryText);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      toast({
        variant: 'destructive',
        title: 'Speech Synthesis Failed',
        description: `An error occurred: ${e.error}`,
      });
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Cleanup function to cancel speech if the component unmounts while speaking
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const InfoCard = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-2 flex flex-col">
      <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">
        {icon} {title}
      </h4>
      <div className="text-sm text-foreground/80 flex-grow">{children}</div>
    </div>
  );

  return (
    <Card className="w-full bg-card/70 backdrop-blur-sm border-none">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BotMessageSquare className="h-6 w-6 text-primary" />
              AI Analysis Complete
            </CardTitle>
            <CardDescription>{getResultTitle(result)}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-background/50 border border-border/50 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          <div className="md:col-span-1 flex justify-center">
            <div className="relative h-32 w-32">
              <svg className="transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={
                    2 * Math.PI * 54 * (1 - score / 100)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold"
                  style={{ color: scoreColor }}
                >
                  {Math.round(score)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  Authenticity
                </span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {getIcon('h-6 w-6')} Verdict: {scoreLabel}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getSummaryText(result, score, scoreLabel).split('Summary: ')[1] || getSummaryText(result, score, scoreLabel).split('Analysis: ')[1]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.type === 'text' && (
            <>
              <InfoCard
                icon={<Lightbulb className="h-4 w-4" />}
                title="Fact-Check Summary"
              >
                <p>{result.factCheckSummary}</p>
              </InfoCard>
              {result.manipulatedPhrases.length > 0 && (
                <InfoCard
                  icon={<Quote className="h-4 w-4" />}
                  title="Potentially Manipulated Phrases"
                >
                  <div className="flex flex-wrap gap-2">
                    {result.manipulatedPhrases.map((phrase, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-primary/10 text-primary-foreground"
                      >
                        {phrase}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>
              )}
            </>
          )}
          {result.type === 'image' && (
            <InfoCard
              icon={<Lightbulb className="h-4 w-4" />}
              title="Analysis"
            >
              <p>{result.explanation}</p>
            </InfoCard>
          )}
          {result.relatedArticles && result.relatedArticles.length > 0 && (
            <InfoCard
              icon={<BookText className="h-4 w-4" />}
              title="Related Articles"
            >
              <ul className="space-y-3">
                {result.relatedArticles.map((article, i) => (
                  <li key={i} className="group">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-foreground/80 hover:text-primary transition-colors"
                    >
                      <span className="font-semibold block group-hover:underline">
                        {article.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {article.source}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4 sm:gap-0">
        <Button
          variant="outline"
          onClick={handleSpeak}
          className="w-full sm:w-auto"
        >
          {isSpeaking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          {isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto">
          <Share2 className="mr-2 h-4 w-4" /> Share Result
        </Button>
      </CardFooter>
    </Card>
  );
};

const analysisSteps = [
  "// INITIALIZING_DEEP_SCAN...",
  "// CROSS_REFERENCING_DATA_MATRICES...",
  "// ANALYZING_SEMANTIC_STRUCTURE...",
  "// CHECKING_FOR_AI_ARTIFACTS...",
  "// VERIFYING_SOURCE_INTEGRITY...",
  "// COMPILING_CREDIBILITY_REPORT...",
  "// RUNNING_FINAL_DIAGNOSTICS...",
  "// DECRYPTING_RESULTS...",
];

const AnalysisInProgress = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % analysisSteps.length);
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[200px]">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-lg font-mono cyberspace-reveal" style={{'--glow-color-1': 'hsl(var(--accent))'} as React.CSSProperties}>
        {analysisSteps[currentStep]}
      </p>
      <p className="text-sm text-muted-foreground">
        Our AI is dissecting the data. This may take a moment.
      </p>
    </div>
  );
};

const TextVerifier = () => {
  const [state, formAction] = useActionState(verifyTextAction, initialTextState);
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState('');
  const { pending } = useFormStatus();

  const handleReset = useCallback(() => {
    formRef.current?.reset();
    setText('');
    // This is a bit of a hack to reset the action state.
    const formData = new FormData();
    formAction(formData);
  }, [formAction]);

  if (pending) {
    return <AnalysisInProgress />;
  }
  
  if (state.data) {
    return (
      <ResultDisplay
        result={{ ...state.data, type: 'text', input: text }}
        onReset={handleReset}
      />
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      onSubmit={(e) => {
        const form = e.currentTarget;
        const textElement = form.elements.namedItem('text') as HTMLTextAreaElement;
        setText(textElement.value);
        formAction(new FormData(form));
      }}
    >
      <Textarea
        name="text"
        placeholder="> ACCESSING DATASTREAM... PASTE TEXT FOR ANALYSIS_"
        className="min-h-[150px] bg-background/50"
        required
      />
      {state.zodErrors?.text && (
        <p className="text-sm text-destructive">{state.zodErrors.text[0]}</p>
      )}
      {state.error && !state.zodErrors && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" className="w-full">Analyze Text</Button>
    </form>
  );
};

const ImageVerifier = () => {
  const [state, setState] = useState(initialImageState);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setIsLoading(true);
    const result = await verifyImageAction(preview);
    setState(result);
    setIsLoading(false);
  };

  const handleReset = () => {
    setState(initialImageState);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  if (isLoading) {
    return <AnalysisInProgress />;
  }

  if (state.data) {
    return (
      <ResultDisplay
        result={{ ...state.data, type: 'image', input: preview! }}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-muted/50 transition-colors',
          isDragging && 'border-primary bg-muted/80'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Image preview"
              className="object-contain h-full w-full rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                > Drop Zone Active.
              </span>{' '}
              Drag file or click.
            </p>
            <p className="text-xs text-muted-foreground">
              SUPPORTED FORMATS: PNG, JPG, WEBP
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button
        onClick={handleSubmit}
        disabled={!preview || isLoading}
        className="w-full"
      >
        Analyze Image
      </Button>
    </div>
  );
};

const AuthPrompt = () => (
  <div className="text-center p-8 flex flex-col items-center justify-center h-full space-y-4">
    <LogIn className="h-12 w-12 text-primary" />
    <h3 className="text-xl font-semibold">Authentication Required</h3>
    <p className="text-muted-foreground">
      Please log in or sign up to use the verification tools and access your
      history.
    </p>
    <div className="flex gap-4 pt-4">
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  </div>
);

export function Verifier() {
  const { user, isUserLoading } = useUser();
  const [activeTab, setActiveTab] = useState('text');
  const [isFlipping, setIsFlipping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    if (value !== activeTab && value !== 'video') {
      setIsFlipping(true);
      setTimeout(() => {
        setActiveTab(value);
        setIsFlipping(false);
      }, 300); // Half of the animation duration
    }
  };

  const renderContent = () => {
    if (isUserLoading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    if (!user) {
      return <AuthPrompt />;
    }
    return (
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 border border-border/50 rounded-lg">
          <TabsTrigger
            value="text"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground rounded-md m-1 flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground rounded-md m-1 flex items-center gap-2"
          >
            <FileImage className="h-4 w-4" />
            Image
          </TabsTrigger>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md m-1 flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Video/URL
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Construction className="h-6 w-6 text-primary" />
                  Feature Under Construction
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The video analysis feature is not live yet. Our developers are
                  working hard to bring it to you very soon. Thank you for your
                  patience!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction>Acknowledged</AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        </TabsList>
        <div className="relative pt-6">
          <TabsContent
            value="text"
            forceMount
            className={cn(
              'transition-opacity duration-300',
              activeTab !== 'text' && 'opacity-0 h-0 overflow-hidden'
            )}
          >
            <TextVerifier />
          </TabsContent>
          <TabsContent
            value="image"
            forceMount
            className={cn(
              'transition-opacity duration-300',
              activeTab !== 'image' && 'opacity-0 h-0 overflow-hidden'
            )}
          >
            <ImageVerifier />
          </TabsContent>
        </div>
      </Tabs>
    );
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        'w-full max-w-3xl mx-auto bg-transparent backdrop-blur-xl border-border/20 shadow-2xl shadow-primary/10',
        isFlipping && 'card-flip'
      )}
      style={{ perspective: '1000px' }}
    >
      <CardContent className="p-2 sm:p-4 md:p-6 min-h-[380px] flex items-center justify-center">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

    