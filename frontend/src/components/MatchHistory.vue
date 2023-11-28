<!-- <template>
    <div class="match-history">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from "chart.js";
  
  export default {
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = this.$refs.chartCanvas.getContext("2d");
  
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Match 1", "Match 2", "Match 3", "Match 4", "Match 5"],
            datasets: [
              {
                label: "Win/Loss",
                borderColor: "blue",
                data: [3, 2, 1, 4, 2],
              },
            ],
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .match-history {
    width: 80%;
    margin: 20px auto;
  }
  </style>
   -->