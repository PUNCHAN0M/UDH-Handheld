import { Audio } from "expo-av";

export const playSound = async (isMatched: boolean):Promise<Audio.Sound | null> => {
    const soundUri = isMatched
        ? require("@/assets/sounds/soundcorrect.mp3") // เสียงเมื่อเจอ true
        : require("@/assets/sounds/soundincorrect.mp3"); // เสียงเมื่อไม่เจอ false

    try {
        const { sound } = await Audio.Sound.createAsync(soundUri);
        await sound.playAsync();
        return sound;
    } catch (error) {
        console.error("Error playing sound:", error);
        return null;
    }
};