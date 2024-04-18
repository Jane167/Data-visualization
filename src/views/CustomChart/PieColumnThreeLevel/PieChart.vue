<template>
  <div id="three-level-pie"></div>
</template>


<script setup>
import {defineProps, reactive, watch, defineEmits, onMounted, defineExpose} from "vue";
import {Pie} from '@antv/g2plot';
import predefineColor from "@/mock/predefineColor.json";
import * as d3 from "d3";


const props = defineProps({
  dataset: {
    type: Object
  },
  typeNameSum: {
    type: Object
  }
})
const emits = defineEmits(['generateColumnDataByClickEvent', 'filterDataByLegendInteract'])


const dataset = () => {
  return props.dataset
}
const typeNameSum = () => {
  return props.typeNameSum
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
let pie
onMounted(() => {
})

watch(() => dataset(), (newVal) => {
  if (newVal) {

    if (newVal.length > 0) {
      draw()
    }
  }
}, {deep: true, immediate: true})

const draw = () => {

  const pieData = dataset()

  const container = document.getElementById('three-level-pie')
  container.innerHTML = ''

  pie = new Pie(container, {
    data: pieData,
    colorField: 'type',
    color: ({type}) => {
      return getColorByType(type)
    },
    legend: {
      position: 'bottom',
      flipPage: false,
    },
    appendPadding: 10,
    height: 270,
    radius: 0.9,
    angleField: 'value',
    label: {
      type: 'outer',
      formatter: ({percent}) => {
        return `${(percent * 100).toFixed(0)}%`
      }
    },
    state: {
      // 设置【active】激活状态样式 - 无描边
      active: {
        style: {
          lineWidth: 0,
        },
      },
    },
    interactions: [
      {
        type: 'element-highlight',
        cfg: {
          showEnable: [{trigger: 'element:mouseenter', action: 'cursor:pointer'}],
          end: [
            {trigger: 'element:mouseleave', action: 'cursor:default'},
            {trigger: 'element:mouseleave', action: 'element-highlight:reset'},
          ],
        },
      },
    ],
  });

  pie.render();


  // 图表单击事件, 过滤数据
  pie.on('element:click', (evt) => {
    const eventData = evt.data;
    if (eventData?.data) {
      if (eventData?.data?.name) { // 如果有name字段，生成三级图表
        const type = eventData.data.type;
        const name = eventData.data.name;


        generatePieDataByClickEvent('third', type, name) // 生成三级饼图数据
        emits('generateColumnDataByClickEvent', 'third', type, name)  // 调用父组件方法, 生成三级级柱状图数据

      } else { // 没有name字段，生成二级图表
        const type = eventData.data.type;
        generateColorMap(type)

        generatePieDataByClickEvent('second', type) // 生成二级饼图数据
        emits('generateColumnDataByClickEvent', 'second', type)  // 调用父组件方法, 生成二级饼图数据
      }
    }
  });

  // 图例添加点击事件
  pie.on('legend-item:click', ({view}) => {
    let arr = []
    let filterField = Object.keys(view.options.filters)[0]
    if (filterField === 'type') {
      view.filteredData.forEach(e => {
        arr.push(e.type)
      })
    } else if (filterField === 'name') {
      view.filteredData.forEach(e => {
        arr.push(e.name)
      })
    }

    emits('filterDataByLegendInteract', arr, filterField)
  });

}

const getColorByType = (type) => {
  const ele = data.colorMap.type.find(e => e.type === type.toLowerCase())
  return ele ? ele.color : '#6395fa'

}

const getColorByName = (name) => {
  const ele = data.colorMap.name.find(e => e.name === name)
  return ele ? ele.color : '#6395fa'
}

const generateColorMap = (type) => {
  let current_dataset = typeNameSum().filter((datum) => datum.type === type)
  let current_name_set = d3.union(current_dataset.map(d => d.name))
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


/**
 * @description 通过图表点击事件进行交互, 生成饼图数据
 * @author Jia yin
 * @param {String} level 层次
 * @param {String} type  一级分类: 类别
 * @param {String} name  二级分类：名字
 */
const generatePieDataByClickEvent = (level, type, name) => {
  if (level === 'first') {
    pie.update({
      data: dataset(),
      colorField: 'type',
      color: ({type}) => {
        return getColorByType(type)
      },
    })
  } else if (level === 'second') {
    pie.update({
      data: typeNameSum().filter((datum) => datum.type === type),
      colorField: 'name',
      color: ({name}) => {
        return getColorByName(name)
      },
    })
  } else if (level === 'third') {
    pie.update({
      data: typeNameSum().filter((datum) => datum.type === type && datum.name === name),
      colorField: 'name',
      color: ({name}) => {
        return getColorByName(name)
      },
    })
  }
}


defineExpose({
  generatePieDataByClickEvent,
})
</script>


<style scoped></style>
