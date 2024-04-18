<template>
  <div id="groupedColumn" class="scrollbar"
       style="height: 100%; position: relative; overflow-x: auto; overflow-y: clip">
    <svg id="three-level-column"/>
  </div>
</template>


<script setup>
import {defineProps, reactive, watch} from "vue";
import * as d3 from "d3";
import predefineColor from "@/mock/predefineColor.json"
import {sortByCharacter} from '@/util'


const props = defineProps({
  dataset: {
    type: Object
  },
  citySum: {
    type: Object
  },
  isStack: {
    type: Boolean
  },
  isGenerateColor: {
    type: Boolean
  },
  current: {
    type: Object
  },
  displayColumnText: {
    type: Boolean
  }
})


const dataset = () => {
  return props.dataset
}
const citySum = () => {
  return props.citySum
}
const isGenerateColor = () => {
  return props.isGenerateColor
}

const data = reactive({
  colorMap: {
    name: [],
    type: [
      {type: '零食', color: '#f18e56'},
      {type: '茶叶', color: '#0dcccc'},
      {type: '水果', color: '#934dff'},
      {type: '米面', color: '#2389ff'},
    ]
  }
});


watch(() => dataset(), (newVal) => {
  if (newVal) {
    drawGroupedColumn()
  }
}, {deep: true})

const drawGroupedColumn = () => {

  const sum_arr = citySum()
  const height = 350;


  const draw = () => {
    const marginTop = 20;
    const marginRight = 40;
    const marginBottom = 20;
    const marginLeft = 40;

    let width = sum_arr.length * 150 + marginRight + marginLeft

    let set = new Set(dataset().map(d => d.city))
    let arr = []
    for (let ele of set) {
      arr.push(ele)
    }

    arr = sortByCharacter(arr, false)

    // 整体的 X 轴比例尺
    const xScaleSub =
        d3.scaleBand()
            .domain(arr)
            .rangeRound([marginLeft, width - marginRight])
            .paddingInner(0.1);


    let type_arr
    type_arr = new Set(dataset().map(d => d.type));
    const bgWidth = 129  // xScaleSub.bandwidth()
    const offset = (xScaleSub.bandwidth() - 129) / 2  // 计算得出偏移量的差


    // 单个步骤的 X 轴比例尺
    const xScale =
        d3.scaleBand()
            .domain(type_arr)
            .rangeRound([0, bgWidth])
            .padding(0.05);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(sum_arr, d => d.value)]).nice()
        .rangeRound([height - marginBottom, marginTop]);

    const rectWidth = xScale.bandwidth()


    // 创建 svg 容器
    const svg = d3.select("#three-level-column")
        .attr("height", height)
        .attr('width', width)
    svg.selectAll('*').remove()


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


    if (!props.isStack) {
      // 添加背景色 (背景色的高度是单个步骤下所有的分类的和)
      svg.append("g")
          .selectAll('.bg-rect')
          .data(sum_arr)
          .join("g")
          .attr("class", "bg-rect")
          .attr("transform", (d) => `translate(${xScaleSub(d.city) + offset},0)`)
          .selectAll('.bg-rect')
          .data(d => [d])
          .join("rect")
          .attr("x", d => xScale(d.city))
          .attr("y", d => yScale(d.value))
          .attr("width", bgWidth)
          // .attr("width", xScaleSub.bandwidth())
          .attr("height", d => yScale(0) - yScale(d.value))
          .attr("fill", '#DEDEDE')
          .attr('cursor', 'pointer')
          .append("title")
          .text(d => `City: ${d.city}\nValue: ${d.value}`)


      // 为每一个步骤添加矩形块
      svg.append("g")
          .selectAll()
          .data(d3.group(dataset(), d => d.city))
          .join("g")
          .attr("transform", ([city]) => {
            return `translate(${xScaleSub(city) + offset},0)`
          })
          .selectAll()
          .data(([, d]) => {
            return d
          })
          .join("rect")
          .attr("x", d => xScale(d.type))
          .attr("y", d => yScale(d.value))
          .attr("width", rectWidth)
          .attr("height", d => yScale(0) - yScale(d.value))
          .attr("fill", d => getColorByType(d.type))
          .attr("fill-opacity", 1)
          .append("title")
          .text(d => `City: ${d.city}\nType: ${d.type}\nValue: ${d.value}`)
    } else {
      if (isGenerateColor()) {
        generateColorMap()
      }
      // 创建一个堆叠生成器
      const stack = d3.stack().keys(d3.union(dataset().map(d => d.name)))
          .value(([, group], key) => {
            return group.get(key).value
          })


      // 使用堆叠生成器处理数据
      let stackedData = stack(d3.index(dataset(), d => d.city, d => d.name));
      svg.append("g")
          .selectAll("g")
          .data(stackedData)
          .join("g")
          .attr('fill', d => getColorByName(d.key))
          .selectAll("rect")
          .data(D => {
            return D.map(d => (d.key = D.key, d))
          })
          .join("rect")
          .attr("x", d => {
            return xScaleSub(d.data[0]) + offset + 6.5
          })
          .attr("y", d => {
            return yScale(d[1])
          })
          .attr("height", d => {
            return yScale(d[0]) - yScale(d[1])
          })
          .attr("width", xScale.bandwidth())
          .append("title")
          .text(d => {
            return `Name: ${d.key}\nPMI: ${d.data[1].get(d.key).value}`
          });
    }

    return svg.node()
  }
  draw()

}

const getColorByType = (type) => {
  const ele = data.colorMap.type.find(e => e.type === type.toLowerCase())
  return ele ? ele.color : '#6395fa'
}

const getColorByName = (name) => {
  const ele = data.colorMap.name.find(e => e.name === name)
  return ele ? ele.color : '#6395fa'

}
const generateColorMap = () => {
  let current_name_set = d3.union(dataset().map(d => d.name))
  // 将 Set 转换为数组
  const arrayFromSet = Array.from(current_name_set);
  // 对数组进行排序
  const current_name_arr = JSON.parse(JSON.stringify(arrayFromSet.sort()))

  let color_map = []

  for (let i in current_name_arr) {
    color_map.push({
      color: predefineColor[i],
      name: current_name_arr[i]
    })
  }
  data.colorMap.name = color_map
}
</script>

<style scope></style>