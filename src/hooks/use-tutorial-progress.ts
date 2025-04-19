
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getTutorialById, getUserTutorialProgress, updateTutorialProgress } from '@/services/api';
import { Tutorial, TutorialLesson, UserTutorialProgress, TutorialProgress } from '@/types/supabase';

export function useTutorialProgress(tutorialId: string | undefined) {
  const { user } = useAuth();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [lessons, setLessons] = useState<TutorialLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<TutorialLesson | null>(null);
  const [progress, setProgress] = useState<UserTutorialProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadTutorialAndProgress = async () => {
      if (!tutorialId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Load tutorial data
        const tutorialData = await getTutorialById(tutorialId);
        if (tutorialData) {
          setTutorial(tutorialData.tutorial);
          setLessons(tutorialData.lessons);
          
          // Set current lesson to first one by default
          if (tutorialData.lessons.length > 0) {
            setCurrentLesson(tutorialData.lessons[0]);
          }
          
          // If user is logged in, load their progress
          if (user) {
            const progressData = await getUserTutorialProgress(user.id, tutorialId);
            if (progressData) {
              setProgress(progressData);
              
              // Find current lesson based on progress
              if (progressData.current_lesson_id) {
                const lesson = tutorialData.lessons.find(l => l.id === progressData.current_lesson_id);
                if (lesson) {
                  setCurrentLesson(lesson);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading tutorial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTutorialAndProgress();
  }, [tutorialId, user]);

  const startTutorial = async () => {
    if (!user || !tutorial || lessons.length === 0) return;
    
    setUpdating(true);
    try {
      const firstLesson = lessons[0];
      const updatedProgress = await updateTutorialProgress(
        user.id,
        tutorial.id,
        firstLesson.id,
        'in_progress' as TutorialProgress,
        0
      );
      
      if (updatedProgress) {
        setProgress(updatedProgress);
        setCurrentLesson(firstLesson);
      }
    } finally {
      setUpdating(false);
    }
  };

  const completeLesson = async (lessonId: string) => {
    if (!user || !tutorial || !progress) return;
    
    setUpdating(true);
    try {
      // Find the completed lesson's index
      const lessonIndex = lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex === -1) return;
      
      // Calculate completed lessons
      const completedLessonCount = Math.max(progress.completed_lessons, lessonIndex + 1);
      
      // Determine next lesson
      let nextLesson = null;
      let tutorialProgress: TutorialProgress = 'in_progress';
      
      if (lessonIndex < lessons.length - 1) {
        // Not the last lesson, move to next one
        nextLesson = lessons[lessonIndex + 1];
      } else {
        // Last lesson completed
        tutorialProgress = 'completed';
      }
      
      const nextLessonId = nextLesson?.id || lessonId;
      
      const updatedProgress = await updateTutorialProgress(
        user.id,
        tutorial.id,
        nextLessonId,
        tutorialProgress,
        completedLessonCount
      );
      
      if (updatedProgress) {
        setProgress(updatedProgress);
        if (nextLesson) {
          setCurrentLesson(nextLesson);
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  const switchToLesson = async (lessonId: string) => {
    if (!user || !tutorial || !progress) return;
    
    // Find the lesson
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    setUpdating(true);
    try {
      const updatedProgress = await updateTutorialProgress(
        user.id,
        tutorial.id,
        lessonId,
        progress.progress,
        progress.completed_lessons
      );
      
      if (updatedProgress) {
        setProgress(updatedProgress);
        setCurrentLesson(lesson);
      }
    } finally {
      setUpdating(false);
    }
  };

  return {
    tutorial,
    lessons,
    currentLesson,
    progress,
    loading,
    updating,
    startTutorial,
    completeLesson,
    switchToLesson
  };
}
