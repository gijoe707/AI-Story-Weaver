import React from 'react';
import type { StoryParams } from '../types';
import { InputField } from './InputField';
import { SparklesIcon, DiceIcon } from './icons';
import { getRandomStoryParams } from '../utils/randomizer';

interface StoryFormProps {
  params: StoryParams;
  setParams: React.Dispatch<React.SetStateAction<StoryParams>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const formFields: { key: keyof StoryParams; label: string; placeholder: string; type: 'input' | 'textarea' | 'select', options?: string[] }[] = [
    { key: 'characters', label: 'Characters', placeholder: 'e.g., Captain Eva, a grizzled space pirate; Android Unit 734, a curious librarian.', type: 'textarea' },
    { key: 'plot', label: 'Plot Outline', placeholder: 'e.g., The characters discover an ancient map leading to a lost technology that could save their dying planet, but a rival corporation is also after it.', type: 'textarea' },
    { key: 'context', label: 'Story Context', placeholder: 'e.g., A galaxy recovering from a century-long war, resources are scarce, and trust is a rare commodity.', type: 'textarea' },
    { key: 'place', label: 'Place / Setting', placeholder: 'e.g., The neon-drenched, rainy streets of Neo-Kyoto; The desolate red deserts of Mars.', type: 'input' },
    { key: 'timePeriod', label: 'Time Period', placeholder: 'e.g., Far future, 25th century; A magical version of the 1920s.', type: 'input' },
    { key: 'genres', label: 'Genre(s)', placeholder: 'e.g., Sci-Fi, Mystery, Cosmic Horror', type: 'input' },
    { key: 'theme', label: 'Core Theme(s)', placeholder: 'e.g., The meaning of humanity; Betrayal and redemption.', type: 'input' },
    { key: 'pointOfView', label: 'Point of View', placeholder: '', type: 'select', options: ['First-person', 'Third-person limited', 'Third-person omniscient'] },
    { key: 'style', label: 'Writing Style', placeholder: 'e.g., Poetic and descriptive; Fast-paced and action-oriented; Noir and gritty.', type: 'input' },
    { key: 'narrative', label: 'Narrative Voice', placeholder: 'e.g., Witty and sarcastic; Solemn and reflective; An unreliable narrator.', type: 'input' },
    { key: 'voice', label: 'Narrator Audio Voice', placeholder: '', type: 'select', options: ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'] },
    { key: 'characterVoiceMapping', label: 'Character Voice Mapping', placeholder: 'e.g., Captain Eva: Zephyr, Android Unit 734: Kore', type: 'textarea' },
    { key: 'pacing', label: 'Pacing', placeholder: 'e.g., Slow burn with a sudden climax; Relentlessly fast from the start.', type: 'input' },
    { key: 'structure', label: 'Structure', placeholder: 'e.g., Linear chronological order; In media res with flashbacks.', type: 'input' },
    { key: 'preferredEnding', label: 'Preferred Ending', placeholder: 'e.g., A bittersweet victory; A shocking twist that changes everything.', type: 'textarea' },
];

export const StoryForm: React.FC<StoryFormProps> = ({ params, setParams, onGenerate, isLoading }) => {
  const handleChange = (key: keyof StoryParams, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleRandomize = () => {
    const randomParams = getRandomStoryParams();
    setParams(randomParams);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-300">1. Weave Your Narrative</h2>
        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-3 rounded-lg transition-colors duration-200"
          aria-label="Randomize form fields"
        >
          <DiceIcon />
          Randomize
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map(field => (
          <div key={field.key} className={['textarea', 'plot', 'characterVoiceMapping'].includes(field.key) || field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <InputField
              id={field.key}
              label={field.label}
              value={params[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              as={field.type}
              options={field.options}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span>Weaving Your Tale...</span>
          </>
        ) : (
          <>
            <SparklesIcon />
            Generate Story
          </>
        )}
      </button>
    </form>
  );
};