<template>
<head>
  <title>Tournament</title>
</head>
<!--
<div class="tournament-schema">
  <div class="round r-of-4">
    <div class="bracket-game">
      <div class="player top win">
        Snute
        <div class="score">
          3
        </div>
      </div>
      <div class="player bot loss">
        TLO
        <div class="score">
          1
        </div>
      </div>
    </div>
    <div class="bracket-game cont">
      <div class="player top loss">
        ToD
        <div class="score">
          0
        </div>
      </div>
      <div class="player bot win">
        MC
        <div class="score">
          3
        </div>
      </div>
    </div>
  </div>
  <div class="connectors r-of-2">
    <div class="top-line"></div>
    <div class="clear"></div>
    <div class="bottom-line"></div>
    <div class="clear"></div>
    <div class="vert-line"></div>
    <div class="clear"></div>
    <div class="next-line"></div>
    <div class="clear"></div>
  </div>
  <div class="round r-of-2">
    <div class="bracket-game">
      <div class="player top loss">
        Snute
        <div class="score">
          2
        </div>
      </div>
      <div class="player bot win">
        MC
        <div class="score">
          3
        </div>
      </div>
    </div>
  </div>
</div>
-->
<PlayerCheckin />
</template>
<script>

  import PlayerCheckin from '@/components/PlayerCheckin.vue';

  export default {
    components: {
      PlayerCheckin
    }
  }
</script>
<style scoped>
.round {
  float: left;
}
.round.r-of-4 {

}
.round.r-of-2 {
  margin-top: 25px;
}
.bracket-game {
  max-width: 125px;
  margin: 10px 0;
}
.player {
  min-width: 100px;
  border: 1px solid #AAA;
  padding-left: 10px;
}
.player.top {
  border-radius: 3px 3px 0 0;
}
.player.bot {
  border-radius: 0 0 3px 3px;
}
.player .score {
  display: inline;
  float: right;
  border-left: 1px solid #AAA;
  padding-left: 10px;
  padding-right: 10px;
  background: #EEE;
}
.player.win {
  background-color: #B8F2B8;
}
.player.loss {
  background-color: #F2B8B8;
}
.connectors {
  float: left;
  min-width: 35px;
}
.connectors.r-of-2 .top-line {
  position: relative;
  top: 30px;
  width: 17px;
  border: 1px solid #AAA;
}
.connectors.r-of-2 .bottom-line {
  position: relative;
  top: 81px;
  width: 17px;
  border: 1px solid #AAA;
}
.connectors.r-of-2 .vert-line {
  position: relative;
  top: 26px;
  left: -16px;
  height: 55px;
  border-right: 2px solid #AAA;
}
.connectors.r-of-2 .next-line {
  position: relative;
  top: -4px;
  left: 17px;
  width: 17px;
  border: 1px solid #AAA;
}
.clear {
  clear: both;
}    </style>
