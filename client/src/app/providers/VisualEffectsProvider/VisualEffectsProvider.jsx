import BgCanvas from '@/shared/ui/BgCanvas'
import NoiseCanvas from '@/shared/ui/NoiseCanvas'
import TerminalOverlay from '@/shared/ui/TerminalOverlay'
import VHSNoise from '@/shared/ui/VHSNoise'

const VisualEffectsProvider = () => {
  return (
    <>
      <TerminalOverlay />
      <VHSNoise />
      {/*<BgCanvas/>*/}
      <NoiseCanvas />
    </>
  )
}

export default VisualEffectsProvider
