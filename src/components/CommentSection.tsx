import React, { useState } from 'react';
import { Comment, CommentFormData, CommentType } from '../types/user';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  ShoppingCart,
  Shield,
  User,
  MoreVertical,
  Check,
  X
} from 'lucide-react';

interface CommentSectionProps {
  formulaId: string;
  comments: Comment[];
  onAddComment: (formulaId: string, comment: CommentFormData) => void;
  onResolveComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  formulaId,
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment
}) => {
  const { currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComment, setNewComment] = useState<CommentFormData>({
    content: '',
    type: 'general'
  });
  const [filter, setFilter] = useState<'all' | 'unresolved' | CommentType>('all');

  const getTypeIcon = (type: CommentType) => {
    switch (type) {
      case 'general': return <MessageCircle className="w-4 h-4" />;
      case 'improvement': return <TrendingUp className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      case 'sales_feedback': return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: CommentType) => {
    switch (type) {
      case 'general': return 'bg-gray-100 text-gray-700';
      case 'improvement': return 'bg-blue-100 text-blue-700';
      case 'safety': return 'bg-red-100 text-red-700';
      case 'sales_feedback': return 'bg-green-100 text-green-700';
    }
  };

  const getTypeLabel = (type: CommentType) => {
    switch (type) {
      case 'general': return 'Bendras';
      case 'improvement': return 'Patobulinimas';
      case 'safety': return 'Sauga';
      case 'sales_feedback': return 'Pardavimų atsiliepimas';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'R&D': return 'text-purple-600';
      case 'Pardavimai': return 'text-green-600';
      case 'Saugos vertintojas': return 'text-red-600';
      case 'Admin': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    if (filter === 'unresolved') return !comment.isResolved;
    return comment.type === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting comment:', newComment);
    console.log('Current user:', currentUser);
    console.log('Formula ID:', formulaId);
    
    if (newComment.content.trim() && currentUser) {
      const commentId = onAddComment(formulaId, newComment);
      console.log('Comment submission result:', commentId);
      if (commentId) {
        console.log('Comment added successfully:', commentId);
        setNewComment({ content: '', type: 'general' });
        setShowAddForm(false);
      } else {
        console.error('Failed to add comment');
      }
    } else {
      console.error('Cannot add comment: missing content or user');
      console.error('Content:', newComment.content.trim());
      console.error('Current user:', currentUser);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unresolvedCount = comments.filter(c => !c.isResolved).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Komentarai ({comments.length})
          </h3>
          {unresolvedCount > 0 && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              {unresolvedCount} neišspręsta
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Pridėti komentarą</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Visi ({comments.length})
        </button>
        <button
          onClick={() => setFilter('unresolved')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'unresolved' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Neišspręsti ({unresolvedCount})
        </button>
        <button
          onClick={() => setFilter('improvement')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'improvement' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Patobulinimai
        </button>
        <button
          onClick={() => setFilter('safety')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'safety' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sauga
        </button>
        <button
          onClick={() => setFilter('sales_feedback')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'sales_feedback' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pardavimai
        </button>
      </div>

      {/* Add comment form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentaro tipas
              </label>
              <select
                value={newComment.type}
                onChange={(e) => setNewComment(prev => ({ ...prev, type: e.target.value as CommentType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">Bendras komentaras</option>
                <option value="improvement">Patobulinimo pasiūlymas</option>
                <option value="safety">Saugos pastaba</option>
                <option value="sales_feedback">Pardavimų atsiliepimas</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentaras
              </label>
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Įveskite savo komentarą..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Atšaukti
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Pridėti komentarą
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'all' ? 'Komentarų nėra' : `Nėra ${filter === 'unresolved' ? 'neišspręstų' : getTypeLabel(filter as CommentType).toLowerCase()} komentarų`}
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                comment.isResolved 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{comment.userName}</span>
                      <span className={`text-sm font-medium ${getRoleColor(comment.userRole)}`}>
                        {comment.userRole}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(comment.type)}`}>
                        {getTypeIcon(comment.type)}
                        <span className="ml-1">{getTypeLabel(comment.type)}</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt !== comment.createdAt && ' (redaguota)'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {comment.isResolved ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Išspręsta</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      {(currentUser.role === 'Admin' || currentUser.role === 'R&D' || currentUser.id === comment.userId) && (
                        <button
                          onClick={() => onResolveComment(comment.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-150"
                          title="Pažymėti kaip išspręsta"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {(currentUser.role === 'Admin' || currentUser.id === comment.userId) && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                          title="Ištrinti komentarą"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-gray-900 leading-relaxed">
                {comment.content}
              </div>
              
              {comment.isResolved && comment.resolvedBy && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="text-xs text-green-700">
                    Išsprendė: {comment.resolvedBy} • {formatDate(comment.resolvedAt!)}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;