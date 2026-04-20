import { INDIAN_CURRICULUM_QA as part1 } from './indianCurriculum_part1';
import { INDIAN_CURRICULUM_QA as part2 } from './indianCurriculum_part2';
import { INDIAN_CURRICULUM_QA as part3 } from './indianCurriculum_part3';
import { INDIAN_CURRICULUM_QA as part4 } from './indianCurriculum_part4';
import { INDIAN_CURRICULUM_QA as part5 } from './indianCurriculum_part5';

export const INDIAN_CURRICULUM_QA = [...part1, ...part2, ...part3, ...part4, ...part5];

export function getCurriculumQuestions(grade?: string, subject?: string, count = 10) {
  let filtered = INDIAN_CURRICULUM_QA;
  if (grade) filtered = filtered.filter(q => q.grade === grade);
  if (subject) filtered = filtered.filter(q => q.subject === subject);
  return filtered.sort(() => Math.random() - 0.5).slice(0, count);
}

export const CURRICULUM_GRADES = ['Pre-KG', 'KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
export const CURRICULUM_SUBJECTS = ['English', 'Math', 'Science', 'EVS', 'Social Studies', 'Hindi', 'GK'];
