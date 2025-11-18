
'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { collection, orderBy, query } from 'firebase/firestore';
import { Loader2, Type, FileImage, Link as LinkIcon, ShieldAlert, BadgeCheck, BadgeHelp, BadgeAlert as BadgeAlertIcon } from 'lucide-react';
import { WithId } from '@/firebase/firestore/use-collection';
import { TextVerification, ImageVerification, VideoVerification } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';


const VerificationItem = ({
  item,
  type,
}: {
  item: WithId<any>;
  type: 'text' | 'image' | 'video';
}) => {
  const getTitle = () => {
    switch (type) {
      case 'text':
        return item.inputText;
      case 'image':
        // For images, we will render the image itself instead of a title.
        return null; 
      case 'video':
        return item.videoUrl;
    }
  };

  const getScore = () => {
    switch (type) {
      case 'text':
        return item.credibilityScore * 100;
      case 'image':
        return (1 - item.deepfakeProbability) * 100;
      case 'video':
        return (1 - item.deepfakeLikelihood) * 100;
    }
  };

  const score = getScore();
  const scoreLabel =
    score > 75
      ? 'Likely Authentic'
      : score > 40
      ? 'Potentially Deceptive'
      : 'Likely Deceptive';
  
  const scoreColor = score > 75 ? "text-green-400" : score > 40 ? "text-yellow-400" : "text-red-400";
  const progressColor = score > 75 ? "bg-green-500" : score > 40 ? "bg-yellow-500" : "bg-red-500";


  const getIcon = (className = "h-5 w-5") => {
    if (score > 75) return <BadgeCheck className={cn(className, "text-green-400")} />;
    if (score > 40) return <BadgeHelp className={cn(className, "text-yellow-400")} />;
    return <BadgeAlertIcon className={cn(className, "text-red-400")} />;
  };

  const title = getTitle();

  return (
    <div className="border bg-background/30 rounded-lg p-4 space-y-3 transition-all hover:border-primary/50 hover:bg-background/50">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                {type === 'text' && <Type className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                {type === 'image' && <FileImage className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                {type === 'video' && <LinkIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                {title && <p className="text-sm font-medium leading-snug line-clamp-2 break-all">{title}</p>}
                {type === 'image' && item.imageUrl && (
                  <div className="w-20 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.imageUrl} alt="Verification history item" className="w-full h-full object-cover" />
                  </div>
                )}
            </div>
            <p className={cn("text-sm font-bold text-right shrink-0", scoreColor)}>{scoreLabel}</p>
        </div>
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-muted-foreground">
                    {item.timestamp ? format(item.timestamp.toDate(), 'PPP p') : 'No date'}
                </p>
                <div className='flex items-center gap-2'>
                    {getIcon("h-4 w-4")}
                    <span className="text-sm font-semibold">{Math.round(score)}%</span>
                </div>
            </div>
            <Progress value={score} className="h-1.5" indicatorClassName={progressColor} />
        </div>
    </div>
  );
};


const HistoryList = ({
  data,
  isLoading,
  error,
  type,
}: {
  data: WithId<any>[] | null;
  isLoading: boolean;
  error: Error | null;
  type: 'text' | 'image' | 'video';
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <ShieldAlert className="mx-auto h-8 w-8 mb-2" />
        <p>Error loading history. Please try again later.</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No {type} verification history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <VerificationItem key={item.id} item={item} type={type} />
      ))}
    </div>
  );
};

export default function ProfilePage() {
  const { user, isUserLoading, firestore } = useFirebase();

  const textVerificationsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(collection(firestore, 'users', user.uid, 'textVerifications'), orderBy('timestamp', 'desc'))
        : null,
    [user, firestore]
  );
  const imageVerificationsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(collection(firestore, 'users', user.uid, 'imageVerifications'), orderBy('timestamp', 'desc'))
        : null,
    [user, firestore]
  );
  const videoVerificationsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(collection(firestore, 'users', user.uid, 'videoVerifications'), orderBy('timestamp', 'desc'))
        : null,
    [user, firestore]
  );

  const {
    data: textHistory,
    isLoading: textLoading,
    error: textError,
  } = useCollection<TextVerification>(textVerificationsQuery);
  const {
    data: imageHistory,
    isLoading: imageLoading,
    error: imageError,
  } = useCollection<ImageVerification>(imageVerificationsQuery);
  const {
    data: videoHistory,
    isLoading: videoLoading,
    error: videoError,
  } = useCollection<VideoVerification>(videoVerificationsQuery);

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto bg-card/70 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-24 w-24 border-2 border-primary/50">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
            <AvatarFallback className="text-3xl bg-muted">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{user.displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className='mt-6'>
              <HistoryList
                data={textHistory}
                isLoading={textLoading}
                error={textError}
                type="text"
              />
            </TabsContent>
            <TabsContent value="image" className='mt-6'>
              <HistoryList
                data={imageHistory}
                isLoading={imageLoading}
                error={imageError}
                type="image"
              />
            </TabsContent>
            <TabsContent value="video" className='mt-6'>
              <HistoryList
                data={videoHistory}
                isLoading={videoLoading}
                error={videoError}
                type="video"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    