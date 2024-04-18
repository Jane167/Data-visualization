<template>
  <div id="volcano-container">
    <svg id="volcanoPlot"/>
  </div>

</template>

<script setup>
import {onMounted} from "vue";
import * as d3 from "d3"
import dataset from '@/mock/dataset_volcano.json'


const legend = [
  {type: 'A', fill: '#c00000'},
  {type: 'B', fill: '#000000'},
]

const strokeColorMap = [
  {type: 'Compartment 1', stroke: '#ff7aae'},
  {type: 'Compartment 2', stroke: '#5691ff'},
  {type: 'Compartment 3', stroke: '#2dd5c5'},
]


onMounted(() => {
  drawVolcanoPlot(dataset)
})

const drawVolcanoPlot = (volcanoList) => {
  d3.select("#volcanoPlot").selectAll('*').remove()

  const margin = {
    top: 40,
    right: 20,
    bottom: 50,
    left: 20,
  };

  const w = document.getElementById('volcano-container').offsetWidth - margin.right - margin.left,
      h = 700 - margin.top - margin.bottom;

  const regionWidth = w / 2;

  const maxValue = Math.max(
      d3.max(volcanoList, function (d) {
        return Number(d.log2FoldChange);
      }),
      Math.abs(d3.min(volcanoList, function (d) {
        return Number(d.log2FoldChange);
      }))
  );
  const maxYValue = Math.ceil(d3.max(volcanoList, function (d) {
    return Number(d.neglog10pval);
  }));


  const svg = d3.select("#volcanoPlot")
      .attr('width', margin.left + w + margin.right)
      .attr('height', margin.top + h + margin.bottom)
      .attr('padding', 50)
      .attr('transform', translation(margin.left, margin.top));

  svg.append("text")
      .attr("fill", "black")
      .attr("x", margin.left)
      .attr("y", h + margin.top + 10)
      .attr("text-anchor", "start")
      .text("Size means Unique Peptides")
      .style('font-weight', 600)

  svg.append("text")
      .attr("fill", "black")
      .attr("x", w + margin.left)
      .attr("y", h + margin.top + 10)
      .attr("text-anchor", "end")
      .text("Log2(FoldChange)")
      .style('font-weight', 600)


  svg.append("text")
      .attr("fill", "black")
      .attr("x", (w / 2) + margin.left)
      .attr("y", margin.top)
      .attr("text-anchor", "start")
      .text("-Log10(p.value)")
      .style('font-weight', 600)


  const xScale = d3.scaleLinear()
      .domain([-maxValue, maxValue])
      .range([0, w])
      .nice();

  const yScale = d3.scaleLinear()
      .domain([maxYValue, 0])
      .range([0, h - margin.top])
      .nice();

  const radiusScale = d3.scaleLinear()
      .domain([
        d3.min(volcanoList, d => Number(d.uniquePeptides)),
        d3.max(volcanoList, d => Number(d.uniquePeptides))
      ])  // 数据范围
      .range([2, 8]);  // 半径范围


  const xAxis = d3.axisBottom(xScale)
      .ticks(10);

  const yAxis = d3.axisLeft(yScale)
      .ticks(10);

  svg.append('g')
      .attr('class', 'axis x')
      .attr('transform', translation(margin.left, h))
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle');

  svg.append('g')
      .attr('class', 'axis y')
      .attr('transform', translation(margin.left + regionWidth, margin.top))
      .call(yAxis)
      .selectAll('text')
      .style('text-anchor', 'left');

  svg
      .append('g')
      .attr('class', 'fill')
      .selectAll('circle')
      .data(volcanoList)
      .join('circle')
      .attr('cx', d => xScale(Number(d.log2FoldChange)) + margin.left)
      .attr('cy', d => yScale(Number(d.neglog10pval)) + margin.top)
      .attr('r', d => radiusScale(Number(d.uniquePeptides)))
      .attr('cursor', 'pointer')
      .attr("fill", d => getColorByType(d.type, 'fill'))
      .attr("stroke", d => getColorByType(d.Compartment, 'stroke'))

      .append('title')
      .text(d => `Uniprot: ${d.Uniprot}\nLabel: ${d.Label}\nType: ${d.type}\nCompartment: ${d.Compartment}`)


  svg.selectAll('.circle-label')
      .data(volcanoList)
      .join('text')
      .attr('class', 'circle-label')
      .attr('x', d => xScale(d.log2FoldChange) + margin.left)
      .attr('y', d => yScale(d.neglog10pval) + margin.top + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'black')


  // 添加图例
  const legendItemHeight = 20;
  const legendItemSpacing = 5;

  const legendType = svg.append('g')
      .selectAll(".legend-type-item")
      .data(legend)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => translation(margin.left, margin.top + (i * (legendItemHeight + legendItemSpacing))));


  legendType.append("circle")
      .attr("cx", 8)
      .attr("cy", legendItemHeight / 2)
      .attr("r", 8)
      .attr("fill", d => d.fill)
      .attr("stroke", d => d.stroke)
      .attr("stroke-width", 2)


  legendType.append("text")
      .attr("x", legendItemHeight + 5)
      .attr("y", legendItemHeight / 2)
      .attr("dy", "0.35em")
      .text(d => d.type)
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");


  const legendCompartment = svg.append('g')
      .selectAll(".legend-legendCompartment-item")
      .data(strokeColorMap)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => translation(margin.left + 100, margin.top + (i * (legendItemHeight + legendItemSpacing))));

  legendCompartment.append("circle")
      .attr("cx", 8)
      .attr("cy", legendItemHeight / 2)
      .attr("r", 8)
      .attr("fill", 'transparent')
      .attr("stroke", d => d.stroke)
      .attr("stroke-width", 2)
  legendCompartment.append("text")
      .attr("x", legendItemHeight + 5)
      .attr("y", legendItemHeight / 2)
      .attr("dy", "0.35em")
      .text(d => d.type)
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");


  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }

  return svg.node()
}


const getColorByType = (type, field) => {
  switch (field) {
    case 'fill':
      return legend.find(e => e.type === type)[field]
    case 'stroke':
      return strokeColorMap.find(e => e.type === type) ? strokeColorMap.find(e => e.type === type)[field] : 'transparent'
    default:
      return 'transparent'
  }
}

</script>

<style scoped>

</style>
