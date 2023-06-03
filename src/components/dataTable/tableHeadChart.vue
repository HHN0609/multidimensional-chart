<template>
    <div id="headChart" ref="headChart"></div>
</template>

<script setup lang="ts">
import { WatchStopHandle, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import vegaEmbed, { VisualizationSpec } from 'vega-embed';
import { SemanticType } from "@/stores/types";
import { View } from 'vega';


let stop: WatchStopHandle;
const props = defineProps<{
    fieldName: string,
    semanticType: SemanticType,
    datas: any[]
}>();

let headChart = ref();
let view: View;
onMounted(() => {
  stop = watchEffect(() => {
    let mark = props.semanticType === "quantitative" ? "area" : "bar"
    let spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: props.datas
      },
      height: 100,
      width: 200,
      mark: { type: mark, tooltip: {content: "encoding"}},
      encoding: {
        x: {field: 'key', type: props.semanticType, axis: null},
        y: {field: 'count', type: 'quantitative',  axis: {title: "", tickMinStep: 1}},
      },
      
    };
    vegaEmbed(headChart.value, spec as string | VisualizationSpec).then((value) => {
      view = value.view;
    });
  });    
});

onUnmounted(() => {
  stop();
  view.finalize();
});

</script>

<style scoped lang="less">
#headChart {
  flex-grow: 1;
  padding: 0;
}
</style>
