<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Pie & Grouped Column</span>
      </div>
    </template>

    <div>
      <AssociatePieChart :dataset="dataset" @filterDataByClickEvent="filterDataByClickEvent"
                         @filterDataByLegendInteract="filterDataByLegendInteract"/>
      <ColumnGroup :dataset="display"/>
    </div>
  </el-card>
</template>

<script>
import AssociatePieChart from "@/components/Chart/AssociatePieChart";
import ColumnGroup from "@/components/Chart/ColumnGroup";
import dataset from '@/mock/dataset1.json'
import {onMounted, reactive, toRefs} from "vue";

export default {
  name: "Pie&GroupedColumn",
  components: {ColumnGroup, AssociatePieChart},

  setup() {
    const data = reactive({
      dataset,
      display: [],

    });
    onMounted(() => {
      data.display = JSON.parse(JSON.stringify(dataset))
    })

    /**
     * @description 通过图表点击事件进行交互, 控制数据的显示隐藏
     * @author Jia yin
     * @param type
     */
    const filterDataByClickEvent = (type) => {
      if (type === "all") {
        data.display = JSON.parse(JSON.stringify(dataset));
      } else {
        const display_arr = dataset.filter(e => e.type === type);
        data.display = JSON.parse(JSON.stringify(display_arr));
      }

    };

    /**
     * @description 通过图例交互, 控制数据的显示隐藏
     * @author Jia yin
     * @param arr 需要展示的多个分类名称
     */
    const filterDataByLegendInteract = (arr) => {
      const display_arr = [];
      for (const i in arr) {
        const temp_arr = dataset.filter(e => e.type === arr[i]);
        display_arr.push(...temp_arr);
      }
      data.display = JSON.parse(JSON.stringify(display_arr));
    };


    return {
      data,
      ...toRefs(data),
      filterDataByClickEvent,
      filterDataByLegendInteract
    }
  }
}
</script>

<style scoped>

</style>