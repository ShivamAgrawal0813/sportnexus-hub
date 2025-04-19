
import { useState, useEffect, useCallback } from 'react';
import { toast } from './use-toast';
import { getUserTutorialProgress, updateTutorialProgress } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { TutorialProgress, TutorialLesson, UserTutorialProgress } from '@/types/supabase';

interface UseTutorialProgressProps {
  tutorialId: string;
  lessons: TutorialLesson[];
}

interface UseTutorialProgressReturn {
  currentLesson: TutorialLesson | null;
  currentLessonIndex: number;
  progress: TutorialProgress;
  completedLessons: number;
  totalLessons: number;
  isLoading: boolean;
  isCompleted: boolean;
  markLessonComplete: (lessonId: string) => Promise<void>;
  moveToNextLesson: () => void;
  moveToPreviousLesson: () => void;
  moveToLesson: (lessonId: string) => void;
}

export const useTutorialProgress = ({ 
  tutorialId, 
  lessons 
}: UseTutorialProgressProps): UseTutorialProgressReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<TutorialProgress>('not_started');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [userProgress, setUserProgress] = useState<UserTutorialProgress | null>(null);
  
  const totalLessons = lessons.length;
  
  // Find the current lesson index
  const currentLessonIndex = currentLessonId 
    ? lessons.findIndex(lesson => lesson.id === currentLessonId)
    : 0;
  
  // Get the current lesson object
  const currentLesson = currentLessonIndex >= 0 && currentLessonIndex < lessons.length
    ? lessons[currentLessonIndex]
    : null;
  
  // Check if tutorial is completed
  const isCompleted = progress === 'completed';
  
  // Fetch the user's progress for this tutorial
  const fetchProgress = useCallback(async () => {
    if (!user || !tutorialId || lessons.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const userProgressData = await getUserTutorialProgress(user.id, tutorialId);
      
      if (userProgressData) {
        setUserProgress(userProgressData);
        setProgress(userProgressData.progress);
        setCompletedLessons(userProgressData.completed_lessons);
        
        // If there's a current lesson ID, use it; otherwise default to the first lesson
        if (userProgressData.current_lesson_id) {
          setCurrentLessonId(userProgressData.current_lesson_id);
        } else {
          setCurrentLessonId(lessons[0].id);
        }
      } else {
        // No progress yet, start with the first lesson
        setProgress('not_started');
        setCompletedLessons(0);
        setCurrentLessonId(lessons[0].id);
      }
    } catch (error) {
      console.error('Error fetching tutorial progress:', error);
      // Default to first lesson if error
      setProgress('not_started');
      setCompletedLessons(0);
      setCurrentLessonId(lessons[0].id);
    } finally {
      setIsLoading(false);
    }
  }, [user, tutorialId, lessons]);
  
  // Initialize on component mount
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);
  
  // Save progress to the database
  const saveProgress = async (
    newLessonId: string,
    newProgress: TutorialProgress,
    newCompletedLessons: number
  ) => {
    if (!user) {
      toast.error('You must be logged in to track progress');
      return;
    }
    
    try {
      await updateTutorialProgress(
        user.id,
        tutorialId,
        newLessonId,
        newProgress,
        newCompletedLessons
      );
      
      // Update local state
      setProgress(newProgress);
      setCurrentLessonId(newLessonId);
      setCompletedLessons(newCompletedLessons);
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
      toast.error('Failed to save progress');
    }
  };
  
  // Mark the current lesson as complete and update progress
  const markLessonComplete = async (lessonId: string) => {
    if (!user) {
      toast.error('You must be logged in to track progress');
      return;
    }
    
    // Find the lesson in the lessons array
    const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) {
      toast.error('Lesson not found');
      return;
    }
    
    // Calculate new completed lessons count
    // If this lesson wasn't previously marked as complete
    let newCompletedLessons = completedLessons;
    const maxCompletedIndex = Math.max(lessonIndex, completedLessons - 1);
    
    if (maxCompletedIndex + 1 > completedLessons) {
      newCompletedLessons = maxCompletedIndex + 1;
    }
    
    // Determine if the tutorial is now completed
    let newProgress: TutorialProgress = progress;
    
    if (newCompletedLessons >= totalLessons) {
      newProgress = 'completed';
      toast.success('Congratulations! You completed the tutorial.');
    } else if (progress === 'not_started') {
      newProgress = 'in_progress';
    }
    
    // Save the progress
    await saveProgress(lessonId, newProgress, newCompletedLessons);
  };
  
  // Move to the next lesson
  const moveToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      
      // Update progress in database
      saveProgress(
        nextLesson.id,
        progress === 'not_started' ? 'in_progress' : progress,
        completedLessons
      );
    }
  };
  
  // Move to the previous lesson
  const moveToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = lessons[currentLessonIndex - 1];
      setCurrentLessonId(prevLesson.id);
      
      // Update progress in database
      saveProgress(prevLesson.id, progress, completedLessons);
    }
  };
  
  // Move to a specific lesson
  const moveToLesson = (lessonId: string) => {
    const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) {
      toast.error('Lesson not found');
      return;
    }
    
    setCurrentLessonId(lessonId);
    
    // Update progress in database
    saveProgress(lessonId, progress, completedLessons);
  };
  
  return {
    currentLesson,
    currentLessonIndex,
    progress,
    completedLessons,
    totalLessons,
    isLoading,
    isCompleted,
    markLessonComplete,
    moveToNextLesson,
    moveToPreviousLesson,
    moveToLesson
  };
};
