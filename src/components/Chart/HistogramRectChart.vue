<template>
  <svg style="width: 100%" id="histogramRect"></svg>
</template>
<script>
import {onMounted} from "vue";
import * as d3 from "d3";
import data from '@/mock/dataset_histogram.json'

export default {
  name: "HistogramRect",
  components: {},

  setup() {


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


        svg.append("g")
            .attr("fill", color)
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", d => {
              return y(d.length)
            })
            .attr("height", d => {
              return y(0) - y(d.length)
            });


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

        let lineColor = 'red'
        annotation.selectAll("line")
            .data(lines)
            .join("line")
            .attr("stroke", lineColor)
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
      // const resizeObserver = new ResizeObserver(entry => {
      //   width = entry[0].contentRect.width
      //   draw()
      // })
      // console.log(container, 'container', resizeObserver)
      // resizeObserver.observe(container)
    }


    return {
      drawHistogramWithConfidenceInterval
    };
  },
}
</script>

<style scoped>

</style>
