<template>
  <div class="stars">
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
body {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
  overflow: auto;
  z-index: -1;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-45deg);
  z-index: -1;
}

.star {
  --star-color: rgb(254, 204, 0);
  --star-tail-length: 6em;
  --star-tail-height: 2px;
  --star-width: calc(var(--star-tail-length) / 6);
  --fall-duration: 9s;
  --tail-fade-duration: var(--fall-duration);
  position: absolute;
  top: var(--top-offset);
  left: 0;
  width: 100vw;
  height: var(--star-tail-height);
  color: var(--star-color);
  background: linear-gradient(45deg, currentColor, transparent);
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  transform: translate3d(104em, 0, 0);
  animation: fall var(--fall-duration) var(--fall-delay) linear infinite,
    tail-fade var(--tail-fade-duration) var(--fall-delay) ease-out infinite;
}
@media screen and (max-width: 750px) {
  .star {
    animation: fall var(--fall-duration) var(--fall-delay) linear infinite;
  }
}
.star:nth-child(1) {
  --star-tail-length: 7.32em;
  --top-offset: 44.75vh;
  --fall-duration: 10.206s;
  --fall-delay: 1.285s;
}
.star:nth-child(2) {
  --star-tail-length: 6.28em;
  --top-offset: 55.92vh;
  --fall-duration: 8.15s;
  --fall-delay: 6.566s;
}
.star:nth-child(3) {
  --star-tail-length: 6.39em;
  --top-offset: 18.21vh;
  --fall-duration: 8.387s;
  --fall-delay: 2.164s;
}
.star:nth-child(4) {
  --star-tail-length: 7.25em;
  --top-offset: 31.71vh;
  --fall-duration: 8.945s;
  --fall-delay: 9.229s;
}
.star:nth-child(5) {
  --star-tail-length: 6.41em;
  --top-offset: 63.07vh;
  --fall-duration: 6.56s;
  --fall-delay: 2.17s;
}
.star:nth-child(6) {
  --star-tail-length: 7.16em;
  --top-offset: -50px;
  --fall-duration: 9.174s;
  --fall-delay: 8.544s;
}
.star:nth-child(7) {
  --star-tail-length: 7.23em;
  --top-offset: 5.11vh;
  --fall-duration: 9.495s;
  --fall-delay: 3.064s;
}
.star:nth-child(8) {
  --star-tail-length: 6.57em;
  --top-offset: 93.16vh;
  --fall-duration: 6.405s;
  --fall-delay: 7.508s;
}
.star:nth-child(9) {
  --star-tail-length: 6.92em;
  --top-offset: 50.45vh;
  --fall-duration: 11.994s;
  --fall-delay: 0.622s;
}
.star:nth-child(10) {
  --star-tail-length: 5.01em;
  --top-offset: 38.07vh;
  --fall-duration: 10.473s;
  --fall-delay: 4.925s;
}
.star:nth-child(11) {
  --star-tail-length: 6.61em;
  --top-offset: 54.52vh;
  --fall-duration: 7.778s;
  --fall-delay: 1.082s;
}
.star:nth-child(12) {
  --star-tail-length: 6.18em;
  --top-offset: 13.65vh;
  --fall-duration: 11.967s;
  --fall-delay: 3.657s;
}
.star:nth-child(13) {
  --star-tail-length: 5.27em;
  --top-offset: -50px;
  --fall-duration: 8.308s;
  --fall-delay: 2.403s;
  left: 20%;
}
.star:nth-child(14) {
  --star-tail-length: 5.02em;
  --top-offset: 78.99vh;
  --fall-duration: 11.23s;
  --fall-delay: 7.585s;
}
.star:nth-child(15) {
  --star-tail-length: 7.39em;
  --top-offset: 88.78vh;
  --fall-duration: 7.467s;
  --fall-delay: 0.32s;
}
.star:nth-child(16) {
  --star-tail-length: 6.44em;
  --top-offset: 38.33vh;
  --fall-duration: 6.237s;
  --fall-delay: 4.54s;
}
.star:nth-child(17) {
  --star-tail-length: 6em;
  --top-offset: 11.6vh;
  --fall-duration: 7.368s;
  --fall-delay: 7.212s;
}
.star:nth-child(18) {
  --star-tail-length: 6.08em;
  --top-offset: 18.35vh;
  --fall-duration: 7.319s;
  --fall-delay: 7.115s;
  left: 20%;
}
.star:nth-child(19) {
  --star-tail-length: 7.04em;
  --top-offset: 29.77vh;
  --fall-duration: 6.408s;
  --fall-delay: 8.511s;
}
.star:nth-child(20) {
  --star-tail-length: 7.12em;
  --top-offset: 67.1vh;
  --fall-duration: 11.812s;
  --fall-delay: 3.322s;
}
.star:nth-child(21) {
  --star-tail-length: 6.09em;
  --top-offset: 20.07vh;
  --fall-duration: 8.941s;
  --fall-delay: 4.351s;
}
.star:nth-child(22) {
  --star-tail-length: 5.11em;
  --top-offset: 84.46vh;
  --fall-duration: 8.112s;
  --fall-delay: 1.022s;
}
.star:nth-child(23) {
  --star-tail-length: 7.47em;
  --top-offset: 41.46vh;
  --fall-duration: 6.475s;
  --fall-delay: 0.95s;
}
.star:nth-child(24) {
  --star-tail-length: 6.71em;
  --top-offset: 19.93vh;
  --fall-duration: 6.302s;
  --fall-delay: 1.006s;
}
.star:nth-child(25) {
  --star-tail-length: 6.81em;
  --top-offset: 22.8vh;
  --fall-duration: 6.067s;
  --fall-delay: 7.705s;
}
.star:nth-child(26) {
  --star-tail-length: 5.35em;
  --top-offset: 87.14vh;
  --fall-duration: 8.814s;
  --fall-delay: 8.072s;
}
.star:nth-child(27) {
  --star-tail-length: 5.53em;
  --top-offset: 2.08vh;
  --fall-duration: 6.527s;
  --fall-delay: 5.378s;
}
.star:nth-child(28) {
  --star-tail-length: 5.96em;
  --top-offset: -50px;
  --fall-duration: 10.783s;
  --fall-delay: 4.505s;
  left: 50%;
}
.star:nth-child(29) {
  --star-tail-length: 5.55em;
  --top-offset: 24.63vh;
  --fall-duration: 6.557s;
  --fall-delay: 9.803s;
}
.star:nth-child(30) {
  --star-tail-length: 6.36em;
  --top-offset: 67.76vh;
  --fall-duration: 11.773s;
  --fall-delay: 8.045s;
}
.star:nth-child(31) {
  --star-tail-length: 6.63em;
  --top-offset: 28.49vh;
  --fall-duration: 7.664s;
  --fall-delay: 4.898s;
}
.star:nth-child(32) {
  --star-tail-length: 5.8em;
  --top-offset: 57.29vh;
  --fall-duration: 10.203s;
  --fall-delay: 4.474s;
}
.star:nth-child(33) {
  --star-tail-length: 5.72em;
  --top-offset: 50.47vh;
  --fall-duration: 8.084s;
  --fall-delay: 4.58s;
}
.star:nth-child(34) {
  --star-tail-length: 5.41em;
  --top-offset: 49.6vh;
  --fall-duration: 6.398s;
  --fall-delay: 2.77s;
}
.star:nth-child(35) {
  --star-tail-length: 6.33em;
  --top-offset: 86.1vh;
  --fall-duration: 6.822s;
  --fall-delay: 2.819s;
}
.star:nth-child(36) {
  --star-tail-length: 5.72em;
  --top-offset: 46.71vh;
  --fall-duration: 8.084s;
  --fall-delay: 4.076s;
}
.star:nth-child(37) {
  --star-tail-length: 7.16em;
  --top-offset: 29.23vh;
  --fall-duration: 11.791s;
  --fall-delay: 3.185s;
}
.star:nth-child(38) {
  --star-tail-length: 7.42em;
  --top-offset: 86.42vh;
  --fall-duration: 8.628s;
  --fall-delay: 5.247s;
}
.star:nth-child(39) {
  --star-tail-length: 7.34em;
  --top-offset: 61.31vh;
  --fall-duration: 11.787s;
  --fall-delay: 7.445s;
}
.star:nth-child(40) {
  --star-tail-length: 5.97em;
  --top-offset: 14.43vh;
  --fall-duration: 7.001s;
  --fall-delay: 6.72s;
}
.star:nth-child(41) {
  --star-tail-length: 7.22em;
  --top-offset: 83.21vh;
  --fall-duration: 9.38s;
  --fall-delay: 8.71s;
}
.star:nth-child(42) {
  --star-tail-length: 6.07em;
  --top-offset: -50px;
  --fall-duration: 7.68s;
  --fall-delay: 8.41s;
  left: 20%;
}
.star:nth-child(43) {
  --star-tail-length: 6.15em;
  --top-offset: 12.35vh;
  --fall-duration: 6.739s;
  --fall-delay: 4.05s;
  left: 30%;
}
.star:nth-child(44) {
  --star-tail-length: 7.41em;
  --top-offset: 80.05vh;
  --fall-duration: 10.254s;
  --fall-delay: 0.554s;
}
.star:nth-child(45) {
  --star-tail-length: 5.5em;
  --top-offset: 93.36vh;
  --fall-duration: 7.114s;
  --fall-delay: 1.21s;
}
.star:nth-child(46) {
  --star-tail-length: 5.36em;
  --top-offset: -50px;
  --fall-duration: 6.964s;
  --fall-delay: 9.463s;
  left: -10%;
}
.star:nth-child(47) {
  --star-tail-length: 6.9em;
  --top-offset: 10.68vh;
  --fall-duration: 9.571s;
  --fall-delay: 7.357s;
}
.star:nth-child(48) {
  --star-tail-length: 7em;
  --top-offset: 64.45vh;
  --fall-duration: 7.328s;
  --fall-delay: 8.554s;
}
.star:nth-child(49) {
  --star-tail-length: 5.79em;
  --top-offset: 31.99vh;
  --fall-duration: 6.967s;
  --fall-delay: 7.364s;
}
.star:nth-child(50) {
  --star-tail-length: 7.28em;
  --top-offset: 31.14vh;
  --fall-duration: 11.371s;
  --fall-delay: 9.903s;
  left: 15%;
}
.star::before,
.star::after {
  position: absolute;
  content: "";
  top: 0;
  left: calc(var(--star-width) / -2);
  width: var(--star-width);
  height: 100%;
  background: linear-gradient(45deg, transparent, currentColor, transparent);
  border-radius: inherit;
  animation: blink 2s linear infinite;
}
.star::before {
  transform: rotate(45deg);
}
.star::after {
  transform: rotate(-45deg);
}

@keyframes fall {
  to {
    transform: translate3d(-30em, 0, 0);
  }
}
@keyframes tail-fade {
  0%,
  50% {
    width: var(--star-tail-length);
    opacity: 1;
  }
  70%,
  80% {
    width: 0;
    opacity: 0.4;
  }
  100% {
    width: 0;
    opacity: 0;
  }
}
@keyframes blink {
  50% {
    opacity: 0.6;
  }
}
</style>
