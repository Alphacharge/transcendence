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
  width: 100%;
  height: 100%;
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
  --star-tail-length: 6vw;
  --star-tail-height: 2px;
  --star-width: calc(var(--star-tail-length) / 6);
  --fall-duration: 20s;
  --tail-fade-duration: var(--fall-duration);
  position: absolute;
  top: calc(var(--top-offset) + 10px);
  left: 0;
  width: 100%;
  height: var(--star-tail-height);
  color: var(--star-color);
  background: linear-gradient(45deg, currentColor, transparent);
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  transform: translate3d(120vw, 0, 0);
  animation: fall var(--fall-duration) var(--fall-delay) linear infinite,
    tail-fade var(--tail-fade-duration) var(--fall-delay) ease-out infinite;
}
@media screen and (max-width: 600px) {
  .star {
    transform: translate3d(160vw, 0, 0);
  }
}
.star:nth-child(1) {
  --star-tail-length: 7.32em;
  --top-offset: -44.75vh;
  --fall-duration: 15.206s;
  --fall-delay: 1.285s;
}
.star:nth-child(2) {
  --star-tail-length: 6.28em;
  --top-offset: -55.92vh;
  --fall-duration: 12.15s;
  --fall-delay: 6.566s;
  right: -200px;
}
.star:nth-child(3) {
  --star-tail-length: 6.39em;
  --top-offset: -18.21vh;
  --fall-duration: 16.387s;
  --fall-delay: 2.164s;
  right: -200px;
}
.star:nth-child(4) {
  --star-tail-length: 7.25em;
  --top-offset: 31.71vh;
  --fall-duration: 12.945s;
  --fall-delay: 9.229s;
}
.star:nth-child(5) {
  --star-tail-length: 6.41em;
  --top-offset: 63.07vh;
  --fall-duration: 13.56s;
  --fall-delay: 2.17s;
}
.star:nth-child(6) {
  --star-tail-length: 7.16em;
  --top-offset: -50px;
  --fall-duration: 16.174s;
  --fall-delay: 8.544s;
}
.star:nth-child(7) {
  --star-tail-length: 7.23em;
  --top-offset: -5.11vh;
  --fall-duration: 12.495s;
  --fall-delay: 3.064s;
}
.star:nth-child(8) {
  --star-tail-length: 6.57em;
  --top-offset: 93.16vh;
  --fall-duration: 14.405s;
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
  --fall-duration: 15.473s;
  --fall-delay: 4.925s;
}
.star:nth-child(11) {
  --star-tail-length: 6.61em;
  --top-offset: 54.52vh;
  --fall-duration: 15.778s;
  --fall-delay: 1.082s;
}
.star:nth-child(12) {
  --star-tail-length: 6.18em;
  --top-offset: 13.65vh;
  --fall-duration: 15.967s;
  --fall-delay: 3.657s;
}
.star:nth-child(13) {
  --star-tail-length: 5.27em;
  --top-offset: 50vh;
  --fall-duration: 18.308s;
  --fall-delay: 2.403s;
  left: 20%;
}
.star:nth-child(14) {
  --star-tail-length: 5.02em;
  --top-offset: 78.99vh;
  --fall-duration: 14.23s;
  --fall-delay: 7.585s;
}
.star:nth-child(15) {
  --star-tail-length: 7.39em;
  --top-offset: 88.78vh;
  --fall-duration: 14.467s;
  --fall-delay: 0.32s;
}
.star:nth-child(16) {
  --star-tail-length: 6.44em;
  --top-offset: 38.33vh;
  --fall-duration: 16.237s;
  --fall-delay: 4.54s;
}
.star:nth-child(17) {
  --star-tail-length: 6em;
  --top-offset: -11.6vh;
  --fall-duration: 18.368s;
  --fall-delay: 7.212s;
}
.star:nth-child(18) {
  --star-tail-length: 6.08em;
  --top-offset: -18.35vh;
  --fall-duration: 16.319s;
  --fall-delay: 7.115s;
  left: 20%;
}
.star:nth-child(19) {
  --star-tail-length: 7.04em;
  --top-offset: -29.77vh;
  --fall-duration: 13.408s;
  --fall-delay: 8.511s;
}
.star:nth-child(20) {
  --star-tail-length: 7.12em;
  --top-offset: -67.1vh;
  --fall-duration: 14.812s;
  --fall-delay: 3.322s;
}
.star:nth-child(21) {
  --star-tail-length: 6.09em;
  --top-offset: -20.07vh;
  --fall-duration: 15.941s;
  --fall-delay: 4.351s;
}
.star:nth-child(22) {
  --star-tail-length: 5.11em;
  --top-offset: -84.46vh;
  --fall-duration: 12.112s;
  --fall-delay: 1.022s;
}
.star:nth-child(23) {
  --star-tail-length: 7.47em;
  --top-offset: -41.46vh;
  --fall-duration: 13.475s;
  --fall-delay: 0.95s;
}
.star:nth-child(24) {
  --star-tail-length: 6.71em;
  --top-offset: 109.93vh;
  --fall-duration: 14.302s;
  --fall-delay: 1.006s;
}
.star:nth-child(25) {
  --star-tail-length: 6.81em;
  --top-offset: 202.8vh;
  --fall-duration: 15.067s;
  --fall-delay: 7.705s;
}
.star:nth-child(26) {
  --star-tail-length: 5.35em;
  --top-offset: 870.14vh;
  --fall-duration: 16.814s;
  --fall-delay: 8.072s;
}
.star:nth-child(27) {
  --star-tail-length: 5.53em;
  --top-offset: 20.08vh;
  --fall-duration: 12.527s;
  --fall-delay: 5.378s;
}
.star:nth-child(28) {
  --star-tail-length: 5.96em;
  --top-offset: -50px;
  --fall-duration: 13.783s;
  --fall-delay: 4.505s;
  left: 50%;
}
.star:nth-child(29) {
  --star-tail-length: 5.55em;
  --top-offset: 24.63vh;
  --fall-duration: 14.557s;
  --fall-delay: 9.803s;
}
.star:nth-child(30) {
  --star-tail-length: 6.36em;
  --top-offset: 670.76vh;
  --fall-duration: 15.773s;
  --fall-delay: 8.045s;
}
.star:nth-child(31) {
  --star-tail-length: 6.63em;
  --top-offset: 125.49vh;
  --fall-duration: 12.664s;
  --fall-delay: 4.898s;
}
.star:nth-child(32) {
  --star-tail-length: 5.8em;
  --top-offset: 57.29vh;
  --fall-duration: 13.203s;
  --fall-delay: 4.474s;
}
.star:nth-child(33) {
  --star-tail-length: 5.72em;
  --top-offset: 120.47vh;
  --fall-duration: 14.084s;
  --fall-delay: 4.58s;
}
.star:nth-child(34) {
  --star-tail-length: 5.41em;
  --top-offset: 49.6vh;
  --fall-duration: 15.398s;
  --fall-delay: 2.77s;
}
.star:nth-child(35) {
  --star-tail-length: 6.33em;
  --top-offset: 123.1vh;
  --fall-duration: 16.822s;
  --fall-delay: 2.819s;
}
.star:nth-child(36) {
  --star-tail-length: 5.72em;
  --top-offset: 118.71vh;
  --fall-duration: 18.084s;
  --fall-delay: 4.076s;
}
.star:nth-child(37) {
  --star-tail-length: 7.16em;
  --top-offset: 118.23vh;
  --fall-duration: 12.791s;
  --fall-delay: 3.185s;
}
.star:nth-child(38) {
  --star-tail-length: 7.42em;
  --top-offset: 110.42vh;
  --fall-duration: 13.628s;
  --fall-delay: 5.247s;
}
.star:nth-child(39) {
  --star-tail-length: 7.34em;
  --top-offset: 61.31vh;
  --fall-duration: 14.787s;
  --fall-delay: 7.445s;
}
.star:nth-child(40) {
  --star-tail-length: 5.97em;
  --top-offset: 14.43vh;
  --fall-duration: 15.001s;
  --fall-delay: 6.72s;
}
.star:nth-child(41) {
  --star-tail-length: 7.22em;
  --top-offset: 83.21vh;
  --fall-duration: 16.38s;
  --fall-delay: 8.71s;
  right: -70px;
}
.star:nth-child(42) {
  --star-tail-length: 6.07em;
  --top-offset: 130vh;
  --fall-duration: 17.68s;
  --fall-delay: 8.41s;
  left: 20%;
}
.star:nth-child(43) {
  --star-tail-length: 6.15em;
  --top-offset: 12.35vh;
  --fall-duration: 12.739s;
  --fall-delay: 4.05s;
  left: 30%;
}
.star:nth-child(44) {
  --star-tail-length: 7.41em;
  --top-offset: 89.05vh;
  --fall-duration: 13.254s;
  --fall-delay: 0.554s;
}
.star:nth-child(45) {
  --star-tail-length: 5.5em;
  --top-offset: 93.36vh;
  --fall-duration: 14.114s;
  --fall-delay: 1.21s;
}
.star:nth-child(46) {
  --star-tail-length: 5.36em;
  --top-offset: 32vh;
  --fall-duration: 15.964s;
  --fall-delay: 9.463s;
  left: -10%;
}
.star:nth-child(47) {
  --star-tail-length: 6.9em;
  --bottom-offset: 10.068vh;
  --fall-duration: 16.571s;
  --fall-delay: 7.357s;
  right: -70px;
}
.star:nth-child(48) {
  --star-tail-length: 7em;
  --top-offset: 64.45vh;
  --fall-duration: 18.328s;
  --fall-delay: 8.554s;
}
.star:nth-child(49) {
  --star-tail-length: 5.79em;
  --bottom-offset: 31.99vh;
  --fall-duration: 12.967s;
  --fall-delay: 7.364s;
}
.star:nth-child(50) {
  --star-tail-length: 7.28em;
  --top-offset: 31.14vh;
  --fall-duration: 13.371s;
  --fall-delay: 9.903s;
  left: 5%;
}

.star:nth-child(51) {
  --star-tail-length: 5.97em;
  --bottom-offset: 104.43vh;
  --fall-duration: 15.001s;
  --fall-delay: 6.72s;
}
.star:nth-child(52) {
  --star-tail-length: 7.22em;
  --top-offset: 83.21vh;
  --fall-duration: 16.38s;
  --fall-delay: 8.71s;
  right: -70px;
}
.star:nth-child(53) {
  --star-tail-length: 6.07em;
  --top-offset: 66vh;
  --fall-duration: 17.68s;
  --fall-delay: 8.41s;
  left: 10%;
}
.star:nth-child(54) {
  --star-tail-length: 6.15em;
  --top-offset: 12.35vh;
  --fall-duration: 12.739s;
  --fall-delay: 4.05s;
  left: 20%;
}
.star:nth-child(55) {
  --star-tail-length: 7.41em;
  --top-offset: 80.05vh;
  --fall-duration: 13.254s;
  --fall-delay: 0.554s;
}
.star:nth-child(56) {
  --star-tail-length: 5.5em;
  --top-offset: 193.36vh;
  --fall-duration: 14.114s;
  --fall-delay: 1.21s;
}
.star:nth-child(57) {
  --star-tail-length: 5.36em;
  --top-offset: 19vh;
  --fall-duration: 15.964s;
  --fall-delay: 9.463s;
  left: -10%;
}
.star:nth-child(58) {
  --star-tail-length: 6.9em;
  --top-offset: 21.068vh;
  --fall-duration: 16.571s;
  --fall-delay: 7.357s;
}
.star:nth-child(59) {
  --star-tail-length: 7em;
  --top-offset: 69.45vh;
  --fall-duration: 18.328s;
  --fall-delay: 8.554s;
  right: -70px;
}
.star:nth-child(60) {
  --star-tail-length: 5.79em;
  --bottom-offset: 31.99vh;
  --fall-duration: 12.967s;
  --fall-delay: 7.364s;
  right: -70px;
}
.star:nth-child(61) {
  --star-tail-length: 7.28em;
  --top-offset: 31.14vh;
  --fall-duration: 13.371s;
  --fall-delay: 9.903s;
  left: 15%;
}
.star:nth-child(62) {
  --star-tail-length: 5.36em;
  --top-offset: 2vh;
  --fall-duration: 150.964s;
  --fall-delay: 9.463s;
  left: -10%;
}
.star:nth-child(63) {
  --star-tail-length: 6.9em;
  --top-offset: 10.068vh;
  --fall-duration: 16.571s;
  --fall-delay: 7.357s;
}
.star:nth-child(64) {
  --star-tail-length: 7em;
  --top-offset: 64.45vh;
  --fall-duration: 18.328s;
  --fall-delay: 8.554s;
}
.star:nth-child(65) {
  --star-tail-length: 5.79em;
  --top-offset: 13.99vh;
  --fall-duration: 12.967s;
  --fall-delay: 7.364s;
}
.star:nth-child(66) {
  --star-tail-length: 7.28em;
  --bottom-offset: 31.14vh;
  --fall-duration: 13.371s;
  --fall-delay: 9.903s;
}

.star:nth-child(67) {
  --star-tail-length: 5.97em;
  --top-offset: 104.43vh;
  --fall-duration: 15.001s;
  --fall-delay: 6.72s;
}
.star:nth-child(68) {
  --star-tail-length: 7.22em;
  --top-offset: 83.21vh;
  --fall-duration: 16.38s;
  --fall-delay: 8.71s;
}
.star:nth-child(69) {
  --star-tail-length: 6.07em;
  --bottom-offset: 15vh;
  --fall-duration: 17.68s;
  --fall-delay: 8.41s;
}
.star:nth-child(70) {
  --star-tail-length: 6.15em;
  --top-offset: 12.35vh;
  --fall-duration: 12.739s;
  --fall-delay: 4.05s;
}
.star:nth-child(71) {
  --star-tail-length: 7.41em;
  --bottom-offset: 80.05vh;
  --fall-duration: 13.254s;
  --fall-delay: 0.554s;
}
.star:nth-child(72) {
  --star-tail-length: 5.5em;
  --top-offset: 93.36vh;
  --fall-duration: 14.114s;
  --fall-delay: 1.21s;
}
.star:nth-child(73) {
  --star-tail-length: 5.36em;
  --bottom-offset: 17vh;
  --fall-duration: 15.964s;
  --fall-delay: 9.463s;
}
.star:nth-child(74) {
  --star-tail-length: 6.9em;
  --top-offset: 910.068vh;
  --fall-duration: 16.571s;
  --fall-delay: 7.357s;
}
.star:nth-child(75) {
  --star-tail-length: 7em;
  --bottom-offset: 64.45vh;
  --fall-duration: 18.328s;
  --fall-delay: 8.554s;
}
.star:nth-child(76) {
  --star-tail-length: 5.79em;
  --top-offset: 131.99vh;
  --fall-duration: 12.967s;
  --fall-delay: 7.364s;
}
.star:nth-child(77) {
  --star-tail-length: 7.28em;
  --top-offset: 131.14vh;
  --fall-duration: 13.371s;
  --fall-delay: 9.903s;
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
