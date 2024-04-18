<template>
  <svg style="width: 100%" id="histogramRect"></svg>
</template>
<script setup>
import {onMounted} from "vue";
import * as d3 from "d3";
import data from '@/mock/dataset_histogram.json'

onMounted(() => {
  drawHistogramWithConfidenceInterval()
});


const drawHistogramWithConfidenceInterval = () => {

  const height = 400;
  const container = document.getElementById('histogramRect')

  let width = container.clientWidth


  const draw = () => {

    const svg = d3.select("#histogramRect").attr("width", width).attr('height', height)
    svg.selectAll('*').remove()


    const bins = d3.bin().thresholds(30)(data.dataset)

    const margin = ({top: 60, right: 20, bottom: 30, left: 40})
    const x = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length - 1].x1])
        .range([margin.left, width - margin.right])


    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height - margin.bottom, margin.top])


    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))


    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

    let color = '#1743ed'

    let area = d3.area().x(d => x(d.x0)).y0(() => y(0)).y1(d => y(d.length)).curve(d3.curveMonotoneX)(bins)


    svg.append("path").attr("d", area).attr("stroke", color).attr("fill", color).attr("fill-opacity", 0.1)
    for (let j = 0; j < bins.length; j++) {
      svg.append("circle")
          .attr("r", 3)
          .attr("fill", color)
          .attr("cx", x(bins[j].x0))
          .attr("cy", y(bins[j].length))

    }


    /**
     * @description 用线标记出置信区间
     */

    let lines = []
    if (data.top) {
      lines.push(data.top)
    }
    if (data.bottom) {
      lines.push(data.bottom)
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
