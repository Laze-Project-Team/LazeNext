import enEasy from '~/competitions/linetrace/templates/en/Easy.laze';
import enHard from '~/competitions/linetrace/templates/en/Hard.laze';
import enMedium from '~/competitions/linetrace/templates/en/Medium.laze';
import jaEasy from '~/competitions/linetrace/templates/ja/Easy.laze';
import jaHard from '~/competitions/linetrace/templates/ja/Hard.laze';
import jaMedium from '~/competitions/linetrace/templates/ja/Medium.laze';
import natenEasy from '~/competitions/linetrace/templates/naten/Easy.laze';
import natenHard from '~/competitions/linetrace/templates/naten/Hard.laze';
import natenMedium from '~/competitions/linetrace/templates/naten/Medium.laze';
import natjaEasy from '~/competitions/linetrace/templates/natja/Easy.laze';
import natjaHard from '~/competitions/linetrace/templates/natja/Hard.laze';
import natjaMedium from '~/competitions/linetrace/templates/natja/Medium.laze';

export const linetraceTemplate: Record<string, Record<string, string>> = {
  ja: {
    Easy: jaEasy,
    Medium: jaMedium,
    Hard: jaHard,
  },
  natja: {
    Easy: natjaEasy,
    Medium: natjaMedium,
    Hard: natjaHard,
  },
  en: {
    Easy: enEasy,
    Medium: enMedium,
    Hard: enHard,
  },
  naten: {
    Easy: natenEasy,
    Medium: natenMedium,
    Hard: natenHard,
  },
};
