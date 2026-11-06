let audioContext: AudioContext | null = null;
let clickVolume = 0.7;

export function setClickVolume(volume: number): void {
  clickVolume = Math.min(1, Math.max(0, volume));
}

function getAudioContext(): AudioContext {
  if (audioContext === null) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playMouseClick(): void {
  if (clickVolume <= 0) {
    return;
  }

  const context = getAudioContext();

  if (context.state === 'suspended') {
    void context.resume();
  }

  const durationSeconds = 0.05;
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const noiseBuffer = context.createBuffer(1, frameCount, context.sampleRate);
  const noiseFrames = noiseBuffer.getChannelData(0);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const decay = 1 - frameIndex / frameCount;
    noiseFrames[frameIndex] = (Math.random() * 2 - 1) * decay * decay;
  }

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const bandPassFilter = context.createBiquadFilter();
  bandPassFilter.type = 'bandpass';
  bandPassFilter.frequency.value = 2400;
  bandPassFilter.Q.value = 1.2;

  const gainNode = context.createGain();
  gainNode.gain.value = clickVolume * 0.5;

  noiseSource.connect(bandPassFilter).connect(gainNode).connect(context.destination);
  noiseSource.start(context.currentTime);
}
