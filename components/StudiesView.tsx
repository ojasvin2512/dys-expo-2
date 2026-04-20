import React, { useState, useMemo } from 'react';
import { getCurriculumQuestions, CURRICULUM_GRADES, CURRICULUM_SUBJECTS } from '../data/indianCurriculum_helpers';

const SUBJECT_COLORS: Record<string, string> = {
  'English':       'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Math':          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Science':       'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'EVS':           'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'Social Studies':'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Hindi':         'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'GK':            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
};

const SUBJECT_EMOJI: Record<string, string> = {
  'English': '📖', 'Math': '🔢', 'Science': '🔬',
  'EVS': '🌿', 'Social Studies': '🗺️', 'Hindi': '🇮🇳', 'GK': '💡',
};

export interface StudiesQuizSession {
  grade: string;
  subject: string;
  questions: { question: string; answer: string; options?: string[] }[];
}

interface StudiesViewProps {
  onStartQuiz: (session: StudiesQuizSession) => void;
}

export const StudiesView: React.FC<StudiesViewProps> = ({ onStartQuiz }) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const questions = useMemo(() => {
    if (!selectedGrade || !selectedSubject) return [];
    return getCurriculumQuestions(selectedGrade, selectedSubject, 100);
  }, [selectedGrade, selectedSubject]);

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setRevealedAnswers(new Set());
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setRevealedAnswers(new Set());
  };

  const handleBack = () => {
    if (selectedSubject) { setSelectedSubject(null); setRevealedAnswers(new Set()); }
    else { setSelectedGrade(null); }
  };

  const handleStartQuiz = () => {
    if (!selectedGrade || !selectedSubject || questions.length === 0) return;
    onStartQuiz({ grade: selectedGrade, subject: selectedSubject, questions });
  };

  // Grade selection
  if (!selectedGrade) {
    return (
      <div className="p-3 space-y-2">
        <p className="text-xs text-[var(--text-secondary)] px-1 font-medium">Select a grade to study:</p>
        {CURRICULUM_GRADES.map(grade => (
          <button key={grade} onClick={() => handleGradeSelect(grade)}
            className="w-full text-left p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{grade === 'Pre-KG' ? '🌱' : grade === 'KG' ? '🌼' : '📚'}</span>
              <div>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{grade}</p>
                <p className="text-xs text-[var(--text-secondary)]">NCERT / CBSE Curriculum</p>
              </div>
              <span className="ml-auto text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]">›</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Subject selection
  if (!selectedSubject) {
    const availableSubjects = CURRICULUM_SUBJECTS.filter(
      sub => getCurriculumQuestions(selectedGrade, sub, 1).length > 0
    );
    return (
      <div className="p-3 space-y-2">
        <button onClick={handleBack} className="flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline mb-2">
          ‹ Back to Grades
        </button>
        <p className="text-xs text-[var(--text-secondary)] px-1 font-medium">{selectedGrade} — Choose a subject:</p>
        {availableSubjects.map(subject => (
          <button key={subject} onClick={() => handleSubjectSelect(subject)}
            className="w-full text-left p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-xl">{SUBJECT_EMOJI[subject] || '📚'}</span>
              <div>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{subject}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SUBJECT_COLORS[subject] || 'bg-gray-100 text-gray-700'}`}>
                  {getCurriculumQuestions(selectedGrade, subject, 100).length} questions
                </span>
              </div>
              <span className="ml-auto text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]">›</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Questions list + Start Quiz button
  return (
    <div className="p-3 space-y-2">
      <button onClick={handleBack} className="flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline mb-1">
        ‹ Back to Subjects
      </button>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{SUBJECT_EMOJI[selectedSubject] || '📚'}</span>
        <div>
          <p className="font-bold text-sm text-[var(--text-primary)]">{selectedGrade} — {selectedSubject}</p>
          <p className="text-[10px] text-[var(--text-secondary)]">{questions.length} questions</p>
        </div>
      </div>

      {/* Start Quiz button */}
      <button
        onClick={handleStartQuiz}
        className="w-full py-3 bg-[var(--accent-color)] text-white font-bold rounded-xl hover:bg-[var(--accent-color-hover)] transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        🎯 Start Quiz in Chat
      </button>

      <p className="text-[10px] text-center text-[var(--text-secondary)]">Or browse questions below</p>

      {questions.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-secondary)] py-8">No questions available.</p>
      ) : (
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <button key={idx} onClick={() => toggleAnswer(idx)}
              className="w-full text-left p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all">
              <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed">
                <span className="text-[var(--text-secondary)] mr-1">{idx + 1}.</span>{q.question}
              </p>
              {revealedAnswers.has(idx) ? (
                <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                  <p className="text-xs font-bold text-[var(--accent-color)]">✅ {q.answer}</p>
                  {q.options && (
                    <div className="mt-1.5 grid grid-cols-2 gap-1">
                      {q.options.map((opt: string, oi: number) => (
                        <span key={oi} className={`text-[10px] px-2 py-1 rounded-lg text-center ${opt === q.answer ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-bold' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1">Tap to hide</p>
                </div>
              ) : (
                <p className="text-[10px] text-[var(--accent-color)] mt-1">Tap to see answer ›</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
