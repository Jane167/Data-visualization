<template>
  <div id="container_pie"></div>
</template>


<script>
import {defineComponent, reactive, watch, toRefs, onMounted} from "vue";
import {Pie} from '@antv/g2plot';
import {each, groupBy} from '@antv/util';

export default defineComponent({
  name: "AssociatePieChart",
  components: {},
  props: {
    dataset: {
      type: Object
    }
  },
  emits: ['filterDataByClickEvent', 'filterDataByLegendInteract'],


  setup(props, context) {


    const dataset = () => {
      return props.dataset
    }
    const data = reactive({});

    onMounted(() => {

    })

    watch(() => dataset(), (newVal) => {
      if (newVal) {
        if (newVal.length > 0) {
          setTimeout(() => {
            draw()
          })
        }
      }
    }, {deep: true, immediate: true})

    const draw = () => {

      const pieData = ((originData) => {
        const groupData = groupBy(originData, 'type');
        const result = [];
        each(groupData, (values, k) => {
          result.push({type: k, value: values.reduce((a, b) => a + b.value, 0)});
        });
        return result;
      })(dataset());

      const container = document.getElementById('container_pie')
      container.innerHTML = ''

      const pie = new Pie(container, {
        data: pieData,
        colorField: 'type',
        color: ({type}) => {
          return getColorByType(type)
        },
        legend: {
          position: 'bottom',
        },
        appendPadding: 10,
        height: 300,
        radius: 0.9,
        angleField: 'value',
        label: {
          type: 'outer',
          formatter: ({percent}) => `${(percent * 100).toFixed(0)}%`
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

      pie.on('element:click', (evt) => {
        const eventData = evt.data;
        if (eventData?.data) {
          const type = eventData.data.type;
          pie.chart.changeData(pieData.filter((datum) => datum.type === type));
          context.emit('filterDataByClickEvent', type)

        }
      });
      // 双击，还原数据
      pie.on('element:dblclick', () => {
        pie.chart.changeData(pieData);
        context.emit('filterDataByClickEvent', 'all')
      });

      // 图例添加点击事件
      pie.on('legend-item:click', ({view}) => {
        let arr = []
        view.filteredData.forEach(e => {
          arr.push(e.type)
        })
        context.emit('filterDataByLegendInteract', arr)
      });

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
  },

})
;
</script>


<style scoped>

</style>