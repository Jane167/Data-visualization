<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">Pie & Column (Tree level)</span>
        <p class="card-desc">This is a three level associate chart, try to click on the pie chart category to go to the
          next level chart. Click the menu to switch back and forth among chart levels. The first level is grouped by
          pie chart and grouped column, the other levels is grouped by pie chart and stacked column.</p>
      </div>
    </template>

    <div>

      <el-button link type="primary" @click="generateDataByClickEvent('first', '', '')">Overall</el-button>
      <span v-show="data.current.type">/</span>
      <el-button link type="primary" @click="generateDataByClickEvent('second', data.current.type, '')"
                 v-show="data.current.type"> {{ data.current.type }}
      </el-button>
      <span v-show="data.current.name">/</span>
      <el-button link type="primary" v-show="data.current.name"> {{ data.current.name }}</el-button>

    </div>

    <div>


      <PieChart :dataset="data.dataset.typeSum" :typeNameSum="data.dataset.typeNameSum" class="width-100"
                ref="pieRef"
                @generateColumnDataByClickEvent="generateColumnDataByClickEvent"
                @filterDataByLegendInteract="filterDataByLegendInteract"/>
      <ColumnChart ref="columnRef" :isStack="data.isStack" :dataset="data.dataset.display"
                   :citySum="data.dataset.citySum"
                   :displayColumnText="data.displayColumnText"
                   :current="data.current"
                   :isGenerateColor="data.isGenerateColor" class="width-100"/>
    </div>

  </el-card>

</template>

<script setup>
import PieChart from "@/views/CustomChart/PieColumnThreeLevel/PieChart"
import ColumnChart from "@/views/CustomChart/PieColumnThreeLevel/ColumnChart"
import {onMounted, reactive, ref} from "vue";
import dataset from "@/mock/dataset_three_associate.json"
import {cloneDeep} from "lodash"

const pieRef = ref(null)
const columnRef = ref(null)
const data = reactive({
  dataset: {
    cityTypeSum: [], // 每城市下, 每个分类的所有数据 (分组柱状图)
    display: [], // 柱状图要展示的数据
    typeSum: [], // 以type为分类求和
    citySum: [],  // 以city为分类求和
    typeNameSum: [], // 以name为分类求和
    allName: [], // 每个城市下, 每个分类下, 每个产品的所有数据 (堆叠柱状图)
  },
  current: {
    type: '',
    name: ''
  },
  isStack: false,
  isGenerateColor: false,
  predefinedColor: [
    "#1783ff",
    "#00c9c9",
    "#f0884d",
    "#d580ff",
    "#7863ff",
    "#60c42d",
    "#325ca0",
    "#5ab7f6",
    "#c4e549",
    "#ef8f41",
    "#8d74f7",
    "#ec5428",
    "#663f12",
    "#6a95f7",
    "#f19d92",
    "#60bac8",
    "#1a4a83",
    "#f8d0a3",
    "#d0db93",
    "#5bbe69"
  ],
  paging: {
    current: 1,
    pageSize: 10,
    list: [],
  },
  displayColumnText: true,
  cityArr: [],  // ["石家庄","上海","北京","杭州","西安","南京","广州","重庆"]
  typeArr: [],  // ["水果", "米面", "零食", "茶叶"]
  nameArr: []
});

onMounted(() => {
  initData()
  generateColumnDataByClickEvent('first', '', '')
});


const initData = () => {
  data.dataset.allName = cloneDeep(dataset)
  data.cityArr = [...new Set(dataset.map(e => e.city))]
  data.typeArr = [...new Set(dataset.map(e => e.type))]
  data.nameArr = [...new Set(dataset.map(e => e.name))]
  data.dataset.citySum = data.cityArr.map((item) => {
    let sum = 0
    dataset.filter(e => e.city === item).forEach(e => sum += e.value)
    return {
      city: item,
      value: sum
    }
  })
  data.dataset.typeSum = data.typeArr.map((item) => {
    let sum = 0
    dataset.filter(e => e.type === item).forEach(e => sum += e.value)
    return {
      type: item,
      value: sum
    }
  })
  data.dataset.cityTypeSum = []
  data.cityArr.forEach(i => {
    data.typeArr.forEach(j => {
      let sum = 0
      dataset.filter(e => e.city === i && e.type === j).forEach(e => sum += e.value)
      data.dataset.cityTypeSum.push({
        city: i,
        type: j,
        value: sum
      })
    })
  })

  data.dataset.display = cloneDeep(data.dataset.cityTypeSum)

  data.dataset.typeNameSum = []
  data.typeArr.forEach(i => {
    let nameArr = [...new Set(dataset.filter(e => e.type === i).map(e => e.name))]
    nameArr.forEach(j => {
      let sum = 0
      dataset.filter(e => e.type === i && e.name === j).forEach(e => sum += e.value)
      data.dataset.typeNameSum.push({
        type: i,
        name: j,
        value: sum
      })
    })
  })
}


/**
 * @description 通过图表点击事件进行交互, 生成饼图数据
 * @author Jia yin
 * @param {String} level 层次
 * @param {String} type  一级分类: 类别
 * @param {String} name  二级分类：名字
 */
const generateColumnDataByClickEvent = (level, type, name) => {

  if (level === "first") {
    data.dataset.display = cloneDeep(data.dataset.cityTypeSum);
    data.current.type = ''
    data.current.name = ''
    data.isStack = false
  } else if (level === 'second') {
    const display_arr = data.dataset.allName.filter(e => e.type === type);
    data.dataset.display = cloneDeep(display_arr);
    data.current.type = type
    data.current.name = ''
    data.isStack = true
    data.isGenerateColor = true
  } else if (level === 'third') {
    const display_arr = data.dataset.allName.filter(e => e.type === type && e.name === name);
    data.dataset.display = JSON.parse(JSON.stringify(display_arr));
    data.current.type = type
    data.current.name = name
    data.isStack = true
    data.isGenerateColor = false

  }
}

const generateDataByClickEvent = (level, type, name) => {
  generateColumnDataByClickEvent(level, type, name)

  pieRef.value.generatePieDataByClickEvent(level, type, name)
}


/**
 * @description 通过图例交互, 过滤数据
 * @author Jia yin
 * @param arr 需要展示的分类/名称集合
 * @param filterField 过滤字段
 */
const filterDataByLegendInteract = (arr, filterField) => {
  if (filterField === 'type') {
    const display_arr = [];
    for (const i in arr) {
      const temp_arr = data.dataset.cityTypeSum.filter(e => e.type === arr[i]);
      display_arr.push(...temp_arr);
    }
    data.dataset.display = JSON.parse(JSON.stringify(display_arr));
  } else if (filterField === 'name') {
    const display_arr = [];
    for (const i in arr) {
      const temp_arr = data.dataset.allName.filter(e => e.name === arr[i] && e.type === data.current.type);
      display_arr.push(...temp_arr);
    }
    data.dataset.display = JSON.parse(JSON.stringify(display_arr));
    data.isGenerateColor = false
  } else {
    if (arr.length === 0) {
      if (data.current.name) {
        generateDataByClickEvent('third', data.current.type, data.current.name)
      } else {
        if (data.current.type) {
          generateColumnDataByClickEvent('second', data.current.type)
        } else {
          generateColumnDataByClickEvent('first')
        }
      }
    }
  }

};


</script>

<style scoped>

</style>