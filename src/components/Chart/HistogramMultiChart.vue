<template>
  <svg style="width: 100%" id="histogramMulti" />
</template>

<script setup>
import * as d3 from "d3";
import data from '@/mock/dataset_multiple_histogram.json'
import {onMounted} from "vue";


onMounted(() => {
  drawHistogramWithConfidenceInterval()
});


function drawHistogramWithConfidenceInterval() {

  const height = 400;
  const container = document.getElementById('histogramMulti')

  let width = container.clientWidth

  const draw = () => {

    const svg = d3.select("#histogramMulti").attr("width", width).attr('height', height)
    svg.selectAll('*').remove()

    let max_arr = []  // 两个 Y 轴最大值
    let data_set_all = []  // 所有的数据点
    for (let i of data) {
      data_set_all.push(...i.dataset)

      let bins_item = d3.bin().thresholds(30)(i.dataset)
      max_arr.push(d3.max(bins_item, d => d.length))
    }
    const bins = d3.bin().thresholds(30)(data_set_all)

    const margin = ({top: 60, right: 20, bottom: 30, left: 40})
    const x = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length - 1].x1])
        .range([margin.left, width - margin.right])


    const y = d3.scaleLinear()
        .domain([0, d3.max(max_arr)]).nice()
        .range([height - margin.bottom, margin.top])


    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))


    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))


    const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

    for (let i of data) {
      let bins_item = d3.bin().thresholds(30)(i.dataset)
      let area = d3.area().x(d => x(d.x0)).y0(() => y(0)).y1(d => y(d.length)).curve(d3.curveMonotoneX)(bins_item)

      let color = '#' + randomColor()

      svg.append("path").attr("d", area).attr("stroke", color).attr("fill", color).attr("fill-opacity", 0.1)
      for (let j = 0; j < bins_item.length; j++) {
        svg.append("circle")
            .attr("r", 3)
            .attr("fill", color)
            .attr("cx", x(bins_item[j].x0))
            .attr("cy", y(bins_item[j].length))

      }


      /**
       * @description 用线标记出置信区间
       */
      let lines = []
      if (i.top) {
        lines.push(i.top)
      }
      if (i.bottom) {
        lines.push(i.bottom)
      }
      const annotation = svg
          .append("g")
          .attr("class", "annotation")

      annotation.selectAll("line")
          .data(lines)
          .join("line")
          .attr("stroke", color)
          .attr('stroke-width', '2px')
          .attr("x1", d => {
            return x(d)
          })
          .attr("x2", d => x(d))
          .attr("y1", y(0))
          .attr("y2", y(y.domain()[1]));
    }


    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    return svg.node();
  }

  draw()

}


</script>

<style scoped>

</style>