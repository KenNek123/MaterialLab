class SoundFX {
  playClick() {}
  playSnap() {}
  playTransition(_layer: 'macro' | 'micro' | 'molecular') {}
  playShutter() {}
  playAtomPing() {}
}

export const sound = new SoundFX();

