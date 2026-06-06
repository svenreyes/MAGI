import type { OnboardingQuestion } from '@/types';

/**
 * Static onboarding questionnaire. Answers bias placeholder agent generation
 * today and will feed the OpenAI prompt once AI generation is wired up.
 */
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'name',
    category: 'identity',
    prompt: 'What should MAGI call you?',
    helperText: 'A first name or nickname is perfect.',
    type: 'text',
    required: true,
  },
  {
    id: 'self_description',
    category: 'identity',
    prompt: 'In a few sentences, who are you right now?',
    helperText: 'Write the way you would describe yourself to a new friend.',
    type: 'longText',
    required: true,
  },
  {
    id: 'driving_forces',
    category: 'values',
    prompt: 'Which of these pull at you the most?',
    helperText: 'Pick up to three.',
    type: 'multi',
    required: true,
    options: [
      { value: 'building', label: 'Building & creating' },
      { value: 'connection', label: 'Love & connection' },
      { value: 'adventure', label: 'Adventure & novelty' },
      { value: 'protection', label: 'Protecting people I love' },
      { value: 'expression', label: 'Art & self-expression' },
      { value: 'meaning', label: 'Meaning & spirituality' },
      { value: 'mastery', label: 'Mastery & growth' },
    ],
  },
  {
    id: 'ambition',
    category: 'ambition',
    prompt: 'What are you working toward these days?',
    helperText: 'Career, projects, personal goals — anything.',
    type: 'longText',
    required: false,
  },
  {
    id: 'relationships',
    category: 'relationships',
    prompt: 'Who matters most in your life right now?',
    type: 'longText',
    required: false,
  },
  {
    id: 'creativity_outlet',
    category: 'creativity',
    prompt: 'How do you express yourself creatively?',
    type: 'text',
    required: false,
  },
  {
    id: 'inner_world',
    category: 'spirituality',
    prompt: 'How connected do you feel to something larger than yourself?',
    type: 'scale',
    required: false,
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Somewhat' },
      { value: '4', label: 'Quite a bit' },
      { value: '5', label: 'Deeply' },
    ],
  },
  {
    id: 'shadow',
    category: 'shadow',
    prompt: 'What part of yourself do you keep mostly private?',
    helperText: 'This stays in your Private circle by default.',
    type: 'longText',
    required: false,
  },
];
