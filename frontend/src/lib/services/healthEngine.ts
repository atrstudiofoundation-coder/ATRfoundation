import type { AdminLearningPath } from '@/components/admin/adminTypes';

export type HealthStatus = 'success' | 'warning' | 'error';

export interface HealthItem {
  id: string;
  entityType: 'path' | 'module' | 'assessment' | 'question';
  label: string;
  status: HealthStatus;
  message: string;
  isBlocking: boolean;
}

export interface HealthReport {
  score: number;
  statusText: 'Published' | 'Ready to Publish' | 'Needs Attention' | 'Not Publishable';
  isPublishable: boolean;
  items: HealthItem[];
  errorCount: number;
  warningCount: number;
  successCount: number;
}

export function validateLearningPath(path?: AdminLearningPath | null): HealthReport {
  if (!path) {
    return {
      score: 0,
      statusText: 'Not Publishable',
      isPublishable: false,
      items: [
        {
          id: 'no-path',
          entityType: 'path',
          label: 'Learning Path Missing',
          status: 'error',
          message: 'No learning path selected for evaluation.',
          isBlocking: true,
        },
      ],
      errorCount: 1,
      warningCount: 0,
      successCount: 0,
    };
  }

  const items: HealthItem[] = [];

  // --- 1. LEARNING PATH CHECKS ---
  if (path.title && path.title.trim().length > 0) {
    items.push({
      id: 'path-title',
      entityType: 'path',
      label: 'Learning Path Title',
      status: 'success',
      message: `Title configured: "${path.title}"`,
      isBlocking: false,
    });
  } else {
    items.push({
      id: 'path-title',
      entityType: 'path',
      label: 'Learning Path Title',
      status: 'error',
      message: 'Learning Path is missing a title.',
      isBlocking: true,
    });
  }

  if (path.description && path.description.trim().length > 0) {
    items.push({
      id: 'path-desc',
      entityType: 'path',
      label: 'Learning Path Description',
      status: 'success',
      message: 'Description configured.',
      isBlocking: false,
    });
  } else {
    items.push({
      id: 'path-desc',
      entityType: 'path',
      label: 'Learning Path Description',
      status: 'warning',
      message: 'Learning Path description is empty.',
      isBlocking: false,
    });
  }

  const modules = path.modules || [];
  if (modules.length > 0) {
    items.push({
      id: 'path-modules-count',
      entityType: 'path',
      label: 'Curriculum Modules',
      status: 'success',
      message: `Contains ${modules.length} curriculum module(s).`,
      isBlocking: false,
    });
  } else {
    items.push({
      id: 'path-modules-count',
      entityType: 'path',
      label: 'Curriculum Modules',
      status: 'error',
      message: 'Learning Path must contain at least one module.',
      isBlocking: true,
    });
  }

  // --- 2. MODULE CHECKS ---
  modules.forEach((mod, modIdx) => {
    const modNum = modIdx + 1;
    const modTag = `Module ${modNum} ("${mod.title || 'Untitled'}")`;

    if (mod.title && mod.title.trim().length > 0) {
      items.push({
        id: `mod-${mod.id}-title`,
        entityType: 'module',
        label: `${modTag} Title`,
        status: 'success',
        message: 'Module title set.',
        isBlocking: false,
      });
    } else {
      items.push({
        id: `mod-${mod.id}-title`,
        entityType: 'module',
        label: `Module ${modNum} Title`,
        status: 'error',
        message: `Module ${modNum} is missing a title.`,
        isBlocking: true,
      });
    }

    if (mod.description && mod.description.trim().length > 0) {
      items.push({
        id: `mod-${mod.id}-desc`,
        entityType: 'module',
        label: `${modTag} Description`,
        status: 'success',
        message: 'Module description set.',
        isBlocking: false,
      });
    } else {
      items.push({
        id: `mod-${mod.id}-desc`,
        entityType: 'module',
        label: `${modTag} Description`,
        status: 'warning',
        message: `${modTag} is missing a description.`,
        isBlocking: false,
      });
    }

    const duration = mod.estimated_duration_minutes;
    if (duration && duration > 0) {
      items.push({
        id: `mod-${mod.id}-duration`,
        entityType: 'module',
        label: `${modTag} Estimated Duration`,
        status: 'success',
        message: `Estimated duration: ${duration} minutes.`,
        isBlocking: false,
      });
    } else {
      items.push({
        id: `mod-${mod.id}-duration`,
        entityType: 'module',
        label: `${modTag} Estimated Duration`,
        status: 'error',
        message: `${modTag} duration must be specified (> 0 mins).`,
        isBlocking: true,
      });
    }

    const resources = mod.resources || [];
    if (resources.length > 0) {
      items.push({
        id: `mod-${mod.id}-resources`,
        entityType: 'module',
        label: `${modTag} Reference Assets`,
        status: 'success',
        message: `Contains ${resources.length} resource(s).`,
        isBlocking: false,
      });
    } else {
      items.push({
        id: `mod-${mod.id}-resources`,
        entityType: 'module',
        label: `${modTag} Reference Assets`,
        status: 'warning',
        message: `${modTag} has no linked reference resources.`,
        isBlocking: false,
      });
    }

    const assessment = mod.assessment;
    if (assessment) {
      items.push({
        id: `mod-${mod.id}-ass-exist`,
        entityType: 'assessment',
        label: `${modTag} Assessment Exam`,
        status: 'success',
        message: `Assessment attached ("${assessment.title || 'Untitled Assessment'}").`,
        isBlocking: false,
      });

      // Check passing marks
      const passMarks = assessment.passing_marks;
      if (passMarks && passMarks > 0) {
        items.push({
          id: `ass-${assessment.id}-pass`,
          entityType: 'assessment',
          label: `${modTag} Passing Threshold`,
          status: 'success',
          message: `Passing score configured: ${passMarks}%.`,
          isBlocking: false,
        });
      } else {
        items.push({
          id: `ass-${assessment.id}-pass`,
          entityType: 'assessment',
          label: `${modTag} Passing Threshold`,
          status: 'error',
          message: `${modTag} assessment missing valid passing score.`,
          isBlocking: true,
        });
      }

      // Check max attempts
      const maxAtt = assessment.max_attempts;
      if (maxAtt && maxAtt > 0) {
        items.push({
          id: `ass-${assessment.id}-att`,
          entityType: 'assessment',
          label: `${modTag} Max Attempt Limit`,
          status: 'success',
          message: `Max attempts limit: ${maxAtt}.`,
          isBlocking: false,
        });
      } else {
        items.push({
          id: `ass-${assessment.id}-att`,
          entityType: 'assessment',
          label: `${modTag} Max Attempt Limit`,
          status: 'warning',
          message: `${modTag} max attempts not explicitly set.`,
          isBlocking: false,
        });
      }

      // Check question count (at least 5 questions recommended/required)
      const questions = assessment.questions || [];
      if (questions.length >= 5) {
        items.push({
          id: `ass-${assessment.id}-qcount`,
          entityType: 'assessment',
          label: `${modTag} Question Bank Size`,
          status: 'success',
          message: `Contains ${questions.length} question(s) (Minimum 5 required).`,
          isBlocking: false,
        });
      } else if (questions.length > 0) {
        items.push({
          id: `ass-${assessment.id}-qcount`,
          entityType: 'assessment',
          label: `${modTag} Question Bank Size`,
          status: 'error',
          message: `${modTag} assessment has only ${questions.length} question(s). At least 5 questions required to publish.`,
          isBlocking: true,
        });
      } else {
        items.push({
          id: `ass-${assessment.id}-qcount`,
          entityType: 'assessment',
          label: `${modTag} Question Bank Size`,
          status: 'error',
          message: `${modTag} assessment has 0 questions configured.`,
          isBlocking: true,
        });
      }

      // Check individual questions
      questions.forEach((q, qIdx) => {
        const qTag = `Q${qIdx + 1} in ${modTag}`;
        if (!q.options || q.options.length < 2) {
          items.push({
            id: `q-${q.id}-opts`,
            entityType: 'question',
            label: `${qTag} Options`,
            status: 'error',
            message: `${qTag} must have at least 2 choice options.`,
            isBlocking: true,
          });
        }
        if (!q.answer || q.answer.length === 0) {
          items.push({
            id: `q-${q.id}-ans`,
            entityType: 'question',
            label: `${qTag} Answer Key`,
            status: 'error',
            message: `${qTag} has no correct answer selected.`,
            isBlocking: true,
          });
        }
        if (!q.topic || q.topic.trim().length === 0) {
          items.push({
            id: `q-${q.id}-topic`,
            entityType: 'question',
            label: `${qTag} Topic Tag`,
            status: 'warning',
            message: `${qTag} is missing a assigned topic tag.`,
            isBlocking: false,
          });
        }
      });
    } else {
      items.push({
        id: `mod-${mod.id}-ass-exist`,
        entityType: 'assessment',
        label: `${modTag} Assessment Exam`,
        status: 'error',
        message: `${modTag} is missing an attached assessment exam.`,
        isBlocking: true,
      });
    }
  });

  // Calculate stats and score
  const errorCount = items.filter(i => i.status === 'error').length;
  const warningCount = items.filter(i => i.status === 'warning').length;
  const successCount = items.filter(i => i.status === 'success').length;
  const totalItems = items.length;

  const isPublishable = errorCount === 0;

  let score = 100;
  if (totalItems > 0) {
    const penaltyPerError = 15;
    const penaltyPerWarning = 5;
    score = Math.max(0, 100 - (errorCount * penaltyPerError + warningCount * penaltyPerWarning));
  }

  let statusText: HealthReport['statusText'] = 'Ready to Publish';
  if (path.status === 'Published') {
    statusText = 'Published';
  } else if (!isPublishable) {
    statusText = 'Not Publishable';
  } else if (warningCount > 0) {
    statusText = 'Needs Attention';
  }

  return {
    score,
    statusText,
    isPublishable,
    items,
    errorCount,
    warningCount,
    successCount,
  };
}
