import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { ONBOARDING_QUESTIONS } from '@/constants/onboarding-questions';
import { useTheme } from '@/hooks/use-theme';
import { appActions } from '@/lib/app-store';
import { buildMemoryImportPrompt } from '@/services/memory';
import type { OnboardingAnswer, OnboardingQuestion } from '@/types';

type AnswerMap = Record<string, string[]>;

const MEMORY_STEP_INDEX = ONBOARDING_QUESTIONS.length;
const TOTAL_STEPS = ONBOARDING_QUESTIONS.length + 1;

export function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [memoryText, setMemoryText] = useState('');

  const isMemoryStep = step === MEMORY_STEP_INDEX;
  const question = ONBOARDING_QUESTIONS[step];

  const orderedAnswers = useMemo<OnboardingAnswer[]>(
    () => ONBOARDING_QUESTIONS.map((q) => ({ questionId: q.id, values: answers[q.id] ?? [] })),
    [answers],
  );

  const memoryPrompt = useMemo(() => buildMemoryImportPrompt(orderedAnswers), [orderedAnswers]);

  const canProceed = isMemoryStep || !question.required || (answers[question.id]?.length ?? 0) > 0;

  function setAnswer(questionId: string, values: string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: values }));
  }

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    finish();
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function finish() {
    appActions.setOnboardingDraft({
      answers: orderedAnswers,
      memoryImportText: memoryText,
    });
    router.replace('/agent-generation');
  }

  return (
    <ScreenContainer contentBottomInset={Spacing.six * 2}>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / TOTAL_STEPS) * 100}%`, backgroundColor: theme.text },
          ]}
        />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Step {step + 1} of {TOTAL_STEPS}
      </ThemedText>

      {isMemoryStep ? (
        <View style={styles.section}>
          <SectionHeader
            title="Bring your memories"
            subtitle="Optional — gives MAGI a head start on who you are."
          />
          <ThemedText type="small">
            Paste this prompt into ChatGPT or Claude, then copy its answer back here. MAGI uses it as
            extra context when generating your agents.
          </ThemedText>
          <View style={[styles.promptBox, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small" themeColor="textSecondary" selectable>
              {memoryPrompt}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Long-press the prompt above to copy it.
          </ThemedText>
          <TextField
            label="Paste the response"
            placeholder="Paste what ChatGPT or Claude wrote about you..."
            value={memoryText}
            onChangeText={setMemoryText}
            multiline
          />
        </View>
      ) : (
        <View style={styles.section}>
          <SectionHeader title={question.prompt} subtitle={question.helperText} />
          <QuestionInput
            question={question}
            values={answers[question.id] ?? []}
            onChange={(values) => setAnswer(question.id, values)}
          />
        </View>
      )}

      <View style={styles.footer}>
        {step > 0 ? (
          <PrimaryButton label="Back" variant="secondary" onPress={goBack} style={styles.flex} />
        ) : null}
        <PrimaryButton
          label={step === TOTAL_STEPS - 1 ? 'Generate my agents' : 'Continue'}
          onPress={goNext}
          disabled={!canProceed}
          style={styles.flex}
        />
      </View>
    </ScreenContainer>
  );
}

function QuestionInput({
  question,
  values,
  onChange,
}: {
  question: OnboardingQuestion;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  if (question.type === 'text' || question.type === 'longText') {
    return (
      <TextField
        placeholder="Type your answer..."
        value={values[0] ?? ''}
        onChangeText={(text) => onChange(text.length ? [text] : [])}
        multiline={question.type === 'longText'}
      />
    );
  }

  const options = question.options ?? [];
  const isMulti = question.type === 'multi';

  function toggle(value: string) {
    if (isMulti) {
      onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
    } else {
      onChange([value]);
    }
  }

  return (
    <View style={styles.chips}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={values.includes(option.value)}
          onPress={() => toggle(option.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128,128,128,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  section: {
    gap: Spacing.three,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  promptBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  flex: {
    flex: 1,
  },
});
