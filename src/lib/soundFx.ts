class SoundFX {
  playClick() {}
  playSnap() {}
  playTransition(_layer: 'macro' | 'micro' | 'molecular') {
    void _layer;
  }
  playShutter() {}
  playAtomPing() {}
}

export const sound = new SoundFX();

