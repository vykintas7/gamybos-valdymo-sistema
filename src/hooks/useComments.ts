import { useState, useEffect, useMemo } from 'react';
import { Comment, CommentFormData } from '../types/user';
import { useAuth } from '../contexts/AuthContext';

const COMMENTS_STORAGE_KEY = 'comments_data';

// Mock comments data
const getInitialComments = (): Comment[] => {
  try {
    const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading comments from localStorage:', error);
  }
  
  return [
  {
    id: '1',
    formulaId: '1',
    userId: '2',
    userName: 'Marija Petraitienė',
    userRole: 'Pardavimai',
    content: 'Klientas pageidauja šiek tiek švelnesnės tekstūros. Galbūt galima sumažinti emulsiklio kiekį?',
    type: 'sales_feedback',
    createdAt: '2024-12-01T10:30:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
    isResolved: false
  },
  {
    id: '2',
    formulaId: '1',
    userId: '3',
    userName: 'Petras Kazlauskas',
    userRole: 'Saugos vertintojas',
    content: 'Reikia patikrinti, ar visi ingredientai atitinka naują REACH reglamentą. Ypač dėl konservantų.',
    type: 'safety',
    createdAt: '2024-12-01T14:15:00Z',
    updatedAt: '2024-12-01T14:15:00Z',
    isResolved: false
  },
  {
    id: '3',
    formulaId: '1',
    userId: '1',
    userName: 'Jonas Jonaitis',
    userRole: 'R&D',
    content: 'Atnaujinau formulę pagal pardavimų atsiliepimus. Sumažinau Cetyl Alcohol kiekį nuo 3% iki 2.5%.',
    type: 'improvement',
    createdAt: '2024-12-02T09:20:00Z',
    updatedAt: '2024-12-02T09:20:00Z',
    isResolved: true,
    resolvedBy: 'Jonas Jonaitis',
    resolvedAt: '2024-12-02T09:20:00Z'
  }
  ];
};

export const useComments = (formulaId?: string) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>(getInitialComments);
  const [loading, setLoading] = useState(false);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving comments to localStorage:', error);
    }
  }, [comments]);

  const formulaComments = useMemo(() => {
    if (!formulaId) return [];
    return comments
      .filter(comment => comment.formulaId === formulaId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [comments, formulaId]);

  const addComment = (formulaId: string, commentData: CommentFormData) => {
    if (!currentUser) {
      console.error('No current user found');
      return null;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      formulaId,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userRole: currentUser.role,
      content: commentData.content,
      type: commentData.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false
    };
    
    setComments(prev => [...prev, newComment]);
    console.log('Comment added successfully, new comments count:', comments.length + 1);
    return newComment.id;
  };

  const updateComment = (id: string, updates: Partial<Comment>) => {
    console.log('Updating comment:', id, updates);
    setComments(prev => prev.map(comment => 
      comment.id === id 
        ? { ...comment, ...updates, updatedAt: new Date().toISOString() }
        : comment
    ));
  };

  const resolveComment = (id: string) => {
    if (!currentUser) return;
    
    console.log('Resolving comment:', id);
    updateComment(id, {
      isResolved: true,
      resolvedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      resolvedAt: new Date().toISOString()
    });
  };

  const deleteComment = (id: string) => {
    console.log('Deleting comment:', id);
    setComments(prev => prev.filter(comment => comment.id !== id));
  };

  const getCommentStats = (formulaId: string) => {
    const formulaComments = comments.filter(c => c.formulaId === formulaId);
    return {
      total: formulaComments.length,
      unresolved: formulaComments.filter(c => !c.isResolved).length,
      byType: {
        general: formulaComments.filter(c => c.type === 'general').length,
        improvement: formulaComments.filter(c => c.type === 'improvement').length,
        safety: formulaComments.filter(c => c.type === 'safety').length,
        sales_feedback: formulaComments.filter(c => c.type === 'sales_feedback').length
      }
    };
  };

  return {
    comments: formulaComments,
    allComments: comments,
    loading,
    addComment,
    updateComment,
    resolveComment,
    deleteComment,
    getCommentStats
  };
};