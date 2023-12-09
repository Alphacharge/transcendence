<template>
  <div class="about">
    <h3>{{ $t("aboutTitle") }}</h3>
    <p>{{ $t("aboutText1") }}</p>
    <p>
    <li>Franziska Kernbach (fkernbac)</li>
    <li>Luca Sordo (lsordo)</li>
    <li>Marius Kölle (nkolle)</li>
    <li>Rouven Betz (rbetz)</li></p>
    <p>{{ $t("aboutText2") }}</p>
    <p>{{ $t("aboutText3") }}</p>
    <p>{{ $t("aboutText4") }}</p>
    <p>rbetz</p>
  </div>
</template>

<style>
.about {
  width: 50%;
  margin-left: 25%;
  margin-top: 4em;
}
.about h3 {
  margin-bottom: 2em;
  text-align: center;
}

.about p {
  margin-bottom: 1.5em;
}

.about li {
  list-style: none;
}
</style>