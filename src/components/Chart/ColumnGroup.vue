<template>
  <div id="groupedColumn" class="scrollbar"
       style="height: 100%; position: relative; overflow-x: auto; overflow-y: clip">
    <svg id="column_group" style="width: 100%"/>
  </div>
</template>


<script>
import {defineComponent, reactive, watch, toRefs, onMounted} from "vue";
import * as d3 from "d3";


export default defineComponent({
  name: "ColumnGroup",
  components: {},
  props: {
    dataset: {
      type: Object
    },

  },

  setup(props) {

    const dataset = () => {
      return props.dataset
    }
    const data = reactive({});
    onMounted(() => {
    })

    watch(() => dataset(), (newVal) => {
      if (newVal) {
        setTimeout(() => {
          drawGroupedColumn()
        })
      }
    }, {deep: true, immediate: true})

    /**
     * @description 以 step 为分类字段, 求出每个分类的总和
     * @returns {*[]}
     */
    const calculateAll = () => {
      let step_arr = new Set(dataset().map(d => d.city))
      let sum_arr = []
      for (let item of step_arr) {
        let temp_arr = dataset().filter(e => e.city === item)
        let sum = d3.sum(temp_arr, d => d.value)

        sum_arr.push({
          city: item,
          value: sum
        })
      }
      return sum_arr
    }

    const drawGroupedColumn = () => {
      const container = document.getElementById('column_group')
      const sum_arr = calculateAll()
      let width = container.clientWidth
      const height = 400;
      calculateAll()

      const draw = () => {


        const marginTop = 10;
        const marginRight = 40;
        const marginBottom = 20;
        const marginLeft = 40;

        const xScaleSub = d3.scaleBand()
                .domain(new Set(dataset().map(d => d.city)))
                .rangeRound([marginLeft, width - marginRight])
                .paddingInner(0.15);

        const type_arr = new Set(dataset().map(d => d.type));


        const xScale =
            d3.scaleBand()
                .domain(type_arr)
                .rangeRound([0, xScaleSub.bandwidth()])
                .padding(0.05);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(sum_arr, d => d.value)]).nice()
            .rangeRound([height - marginBottom, marginTop]);

        // 创建 svg 容器
        const svg = d3.select("#column_group")
            .attr("height", height)
            .attr('width', width)
        svg.selectAll('*').remove()

        let tooltip = d3.select('#groupedColumn')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '100')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .style('font-size', '12px')
            .text('tooltip');


        // 添加水平轴 (X 轴)
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScaleSub).tickSizeOuter(0))

        // 添加左边的Y轴
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(yScale).ticks(null, "s"))
            .call(g => g.selectAll('.tick line').clone()
                .attr('x2', width - marginLeft - marginRight)
                .attr('stroke-opacity', 0.2)
            )

        // 添加右边的Y轴
        svg.append("g")
            .attr("transform", `translate(${width - marginRight},0)`)
            .call(d3.axisRight(yScale).ticks(null, "s"))


        // 添加背景灰色
        svg.append("g")
            .selectAll('.bg-rect')
            .data(sum_arr)
            .join("g")
            .attr("class", "bg-rect")
            .attr("transform", (d) => `translate(${xScaleSub(d.city)},0)`)
            .selectAll('.bg-rect')
            .data(d => [d])
            .join("rect")
            .attr("x", d => xScale(d.city))
            .attr("y", d => yScale(d.value))
            .attr("width", xScaleSub.bandwidth())
            .attr("height", d => yScale(0) - yScale(d.value))
            .attr("fill", '#DEDEDE')
            .attr('cursor', 'pointer')
            .on('mouseover', function (d, i) {
              tooltip
                  .html(
                      `<div>City: ${i.city}</div><div>Sum: ${i.value}</div>`
                  )
                  .style('visibility', 'visible');
              d3.select(this).transition().attr('fill', '#999999');
            })
            .on('mousemove', function (event) {
              tooltip
                  .style('top', event.offsetY - 10 + 'px')
                  .style('left', event.offsetX + 10 + 'px');
            })
            .on('mouseout', function () {
              tooltip.html(``).style('visibility', 'hidden');
              d3.select(this).transition().attr('fill', '#dedede');
            });

        svg.append("g")
            .selectAll()
            .data(d3.group(dataset(), d => d.city))
            .join("g")
            .attr("transform", ([city]) => {
              return `translate(${xScaleSub(city)},0)`
            })
            .selectAll()
            .data(([, d]) => d)
            .join("rect")
            .attr("x", d => xScale(d.type))
            .attr("y", d => yScale(d.value))
            // .attr("width", rectWidth)
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(0) - yScale(d.value))
            .attr("fill", d => getColorByType(d.type))
            .attr("fill-opacity", 1)


        // 为每个柱子添加文本信息
        svg.append('g')
            .selectAll()
            .data(d3.group(dataset(), d => d.city))
            .join("g")
            .attr("transform", ([city]) => `translate(${xScaleSub(city)},0)`)
            .selectAll('text')
            .data(([, d]) => d)
            .join("text")
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr("x", d => xScale(d.type) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.value) - 1)
            .text(d => d.value ? d.value : '');


        return svg.node()
      }
      draw()

    }

    const getColorByType = (type) => {
      const colorMap = [
        {type: '水果', color: '#8d43ff'},
        {type: '米面', color: '#00c9c9'},
        {type: '零食', color: '#f0884d'},
        {type: '茶叶', color: '#1783ff'},
      ]
      const ele = colorMap.find(e => e.type === type.toLowerCase())
      const color = ele ? ele.color : '#1783ff'
      return color

    }

    return {
      data,
      ...toRefs(data),
    };
  }

});
</script>


<style scoped>
.scrollbar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

.scrollbar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
}

.scrollbar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>