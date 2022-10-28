import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      // await console.log(container);
    },
    []
  );
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        particles: {
          color: {
            value: ["#E3F8FF", "#28CC9E", "#A6ED8E"],
          },
          move: {
            enable: true,
            direction: "top-right",
            random: true,
            speed: 1.5,
          },
          number: {
            value: 50,
          },
          opacity: {
            value: 0.6,
            random: {
              enable: true,
              minimumValue: 0.3,
            },
          },
          shape: {
            type: ["square", "circle"],
          },
          size: {
            value: 2,
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
