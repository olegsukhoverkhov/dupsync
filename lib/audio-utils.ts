/**
 * Create a WAV file with silence of specified duration
 */
export function createSilenceWav(durationSeconds: number, sampleRate = 16000): Buffer {
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  // PCM data is all zeros = silence

  return buffer;
}

/**
 * Concatenate two audio buffers (simple binary concatenation for MP3)
 * For proper concatenation, both should be MP3 format
 */
export function concatAudioBuffers(a: Buffer, b: Buffer): Buffer {
  return Buffer.concat([a, b]);
}
