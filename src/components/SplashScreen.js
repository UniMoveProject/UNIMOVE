/**
 * UniMove Motion Splash Screen
 * Displays a high-energy brand motion animation whenever the page loads or restores.
 */

export function showSplashScreen() {
  if (document.getElementById('uniMoveSplashScreen')) return;

  const splash = document.createElement('div');
  splash.id = 'uniMoveSplashScreen';
  splash.className = 'unimove-splash-overlay';

  splash.innerHTML = `
    <!-- Background Animated Speed Glows -->
    <div class="splash-glow-bg splash-glow-yellow"></div>
    <div class="splash-glow-bg splash-glow-blue"></div>

    <!-- Motion Speed Lines -->
    <div class="splash-speed-lines">
      <div class="speed-line line-1"></div>
      <div class="speed-line line-2"></div>
      <div class="speed-line line-3"></div>
      <div class="speed-line line-4"></div>
    </div>

    <!-- Main Motion Content Container -->
    <div class="splash-content">
      
      <!-- Shield Logo Container with Pulse Aura -->
      <div class="splash-logo-wrapper">
        <div class="splash-logo-aura"></div>
        <img src="/logo.png" alt="UniMove Shield Logo" class="splash-logo-img" />
      </div>

      <!-- Brand Title with Motion Reveal -->
      <h1 class="splash-title">
        <span class="splash-title-text">UNIMOVE</span>
      </h1>

      <!-- Tagline & Progress Bar -->
      <div class="splash-tagline">MOBILIDADE ACADÊMICA</div>

      <div class="splash-loader-bar">
        <div class="splash-loader-progress"></div>
      </div>

    </div>
  `;

  document.body.appendChild(splash);

  // Trigger exit animation after ~1.6s
  setTimeout(() => {
    splash.classList.add('splash-exit');
    setTimeout(() => {
      if (splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 550);
  }, 1650);
}
