<template>
  <div style="width: 100%">
    <svg id="box_plot" style="width: 100%" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as d3 from "d3";
import dataset from "@/mock/dataset_boxplot"




onMounted(() => {
  drawBoxPlot()
})


function drawBoxPlot() {

  const chart_id = '#box_plot'

  const margin = ({ top: 10, right: 10, bottom: 20, left: 30 })
  const height = 600

  document.getElementById('box_plot').innerHTML = ''

  const width = d3
    .select(chart_id).node().getBoundingClientRect().width


  const boxWidth = 50
  const rd = dataset.slice().sort((a, b) => d3.ascending(a.name, b.name))

  const yScale = d3.scaleLinear()
    .domain(d3.extent(rd, d => d.value))
    .range([height - margin.bottom, margin.top])
    .nice()

  const xScale = d3.scaleBand()
    .domain(boxes().map(d => d.key))
    .range([margin.left, width - margin.right])
    .paddingInner(1)
    .paddingOuter(.5)


  const chart = d3
    .select(chart_id)
    .attr('height', height)
  // .attr('width', width)
  const groups = chart.selectAll("g")
    .data(boxes())
    .join("g")
    .attr("transform", d => `translate(${xScale(d.key)}, 0)`)
    .attr('class', 'ind')
  groups
    .selectAll("vertLine")
    .data(d => [d.range])
    .join("line")
    .attr("class", "vertLine")
    .attr("stroke", "#7e7e7e")
    .attr('stroke-width', '1px')
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", d => yScale(d[0]))
    .attr("y2", d => yScale(d[1]))
  groups
    .selectAll('horizontalLine')
    .data((d) => [d.range[0], d.quartiles[1], d.range[1]])
    .join('line')
    .attr('class', 'horizontalLine')
    .attr('stroke', '#7e7e7e')
    .attr('stroke-width', '1px')
    .style('width', boxWidth)
    .attr('x1', -boxWidth / 2)
    .attr('x2', boxWidth / 2)
    .attr('y1', (d) => yScale(d))
    .attr('y2', (d) => yScale(d))
  groups
    .selectAll("points")
    .data(d => d.dat)
    .join("circle")
    .attr("cx", () => 0 - 30 / 2 + Math.random() * 30)
    .attr("cy", d => yScale(d.value))
    .attr("r", 2)
    .style("fill", "#1867c0")
    .attr("fill-opacity", 1)
  groups
    .selectAll("box")
    .data(d => [d])
    .join("rect")
    .attr("class", "box")
    .attr("x", -boxWidth / 2)
    .attr("y", d => yScale(d.quartiles[2]))
    .attr("height", d => yScale(d.quartiles[0]) - yScale(d.quartiles[2]))
    .attr("width", boxWidth)
    .attr("stroke", "#545454")
    .style("fill", "#1890ff")
    .style("fill-opacity", 0.3)

  /* Y axis */
  chart.append("g")
    .style("font", "12px")
    .style('stroke-width', '1px')
    .call(d3.axisLeft(yScale).tickSizeOuter(0))
    .attr('transform', `translate(${margin.left},0)`)
    .call(g => g.selectAll('.tick line').clone()
      .attr('x2', width - margin.left - margin.right)
      .attr('stroke-opacity', 0.2)
    )

  /* X axis */
  chart.append('g')
    .style('font', '12px')
    .style('stroke-width', '1px')
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))


  const tooltip = d3.select(chart_id).append('div')

  chart.selectAll('.ind').on("mousemove", function (event) {

    tooltip
      .attr('class', 'tooltip')
      .style('opacity', 1)
      .style('transform', `translate(${event.clientX - 50}px,${event.clientY - 50}px)`)
      .text('test: tooltip')
  })
  groups.on("mouseleave", function () {
    tooltip
      .style('opacity', 0)
  })

  return chart.node()
}


const boxes = () => {
  let arrMap = Array.from(d3.group(dataset, d => d.name), ([key, dat]) => ({ key, dat }))
  arrMap.map(o => {
    const values = o.dat.map(d => d.value);
    const min = d3.min(values);
    const max = d3.max(values);
    const q1 = d3.quantile(values, .25);
    const q2 = d3.quantile(values, .5);
    const q3 = d3.quantile(values, .75);
    const iqr = q3 - q1;
    const r0 = Math.max(min, q1 - iqr * 1.5);
    const r1 = Math.min(max, q3 + iqr * 1.5);
    o.quartiles = [q1, q2, q3];
    o.range = [r0, r1];
    o.outliers = values.filter(v => v < r0 || v > r1);
    return o;
  });
  return (arrMap)
};




</script>
<style></style>
