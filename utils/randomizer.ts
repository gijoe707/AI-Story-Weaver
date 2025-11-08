import type { StoryParams } from '../types';

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomOptions = {
    characters: [
        "A stoic cyborg detective with a mysterious past; a cheerful holographic pop star who knows too much.",
        "An elderly librarian who can talk to books; a mischievous cat who is actually a dragon in disguise.",
        "A time-traveling historian trying to blend in at a 1920s jazz club; a determined mob boss who suspects nothing.",
        "A young botanist who discovers a plant that grows pure data; a corporate spy sent to steal it."
    ],
    plot: [
        "A seemingly routine investigation into a missing person uncovers a city-wide conspiracy involving illegal neural implants and a forgotten AI.",
        "A magical artifact is stolen from a high-security vault, and the main characters must track it across parallel dimensions before it falls into the wrong hands.",
        "An ancient prophecy foretells the end of the world, and an unlikely group of heroes must band together to find a loophole in the cosmic decree.",
        "In a city where emotions are outlawed, the characters start experiencing forbidden feelings, leading them on a quest to rediscover their humanity."
    ],
    context: [
        "A cyberpunk megalopolis where corporations have more power than governments, and the line between human and machine is blurred.",
        "A high-fantasy kingdom on the brink of a civil war, where magic is fading and old alliances are crumbling.",
        "A post-apocalyptic wasteland where survivors huddle in fortified settlements, scavenging the ruins of the old world.",
        "A whimsical world where fairy tales are real, but have taken a dark and twisted turn."
    ],
    place: [
        "The floating sky-islands of Aethelgard.",
        "The sunken, bioluminescent city of Aquaria.",
        "The clockwork metropolis of Cogsworth.",
        "The endless, shifting desert known as the Sand Sea."
    ],
    timePeriod: [
        "A distant, technologically advanced future.",
        "An alternate-history Victorian era powered by steam and alchemy.",
        "A mythical age of gods and monsters.",
        "The roaring twenties, but with elves and dwarves."
    ],
    genres: [
        "Sci-Fi Noir",
        "Steampunk Fantasy",
        "Mythological Adventure",
        "Urban Fantasy Mystery"
    ],
    theme: [
        "Identity and what it means to be human.",
        "The conflict between fate and free will.",
        "The price of progress and technology.",
        "The corrupting influence of power."
    ],
    pointOfView: ['First-person', 'Third-person limited', 'Third-person omniscient'],
    style: [
        "Minimalist and punchy, with short sentences.",
        "Lyrical and verbose, with rich descriptions.",
        "Fast-paced and dialogue-heavy.",
        "Bleak and atmospheric, focusing on mood."
    ],
    narrative: [
        "An unreliable narrator who may be hiding the truth.",
        "A cynical, world-weary voice.",
        "An optimistic and slightly naive perspective.",
        "A detached, almost clinical observer."
    ],
    voice: ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'],
    pacing: [
        "A gradual build-up of tension leading to an explosive finale.",
        "A roller-coaster ride of action and quiet moments.",
        "A slow, contemplative journey of discovery."
    ],
    structure: [
        "A non-linear narrative that jumps between timelines.",
        "A classic three-act structure.",
        "An episodic structure with self-contained chapters that form a larger arc."
    ],
    preferredEnding: [
        "A tragic ending where the hero sacrifices everything.",
        "A hopeful conclusion that hints at a brighter future.",
        "A shocking twist that re-contextualizes the entire story.",
        "A quiet, bittersweet resolution."
    ]
};

const generateRandomVoiceMapping = (characters: string): string => {
    const availableVoices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
    const characterNames = characters.match(/\b[A-Z][a-z]+(?: [A-Z][a-z]+|\s\d+)?\b/g) || [];

    if (characterNames.length === 0) {
        return "Character One: Zephyr, Character Two: Kore"; 
    }

    const usedVoices: string[] = [];
    const mapping = characterNames.map(name => {
        let randomVoice: string;
        do {
            randomVoice = getRandomItem(availableVoices);
        } while(usedVoices.includes(randomVoice) && usedVoices.length < availableVoices.length)
        usedVoices.push(randomVoice);

        return `${name.trim()}: ${randomVoice}`;
    });

    return mapping.slice(0, 2).join(', ');
};

export const getRandomStoryParams = (): StoryParams => {
    const newParams: { [key: string]: string } = {};
    for (const key in randomOptions) {
        newParams[key as keyof StoryParams] = getRandomItem(randomOptions[key as keyof typeof randomOptions]);
    }

    newParams.characterVoiceMapping = generateRandomVoiceMapping(newParams.characters!);
    
    return {
        characters: '',
        context: '',
        place: '',
        timePeriod: '',
        pointOfView: 'Third-person omniscient',
        genres: '',
        theme: '',
        style: '',
        preferredEnding: '',
        plot: '',
        structure: '',
        pacing: '',
        narrative: '',
        voice: 'Kore',
        characterVoiceMapping: '',
        ...newParams
    } as StoryParams;
};