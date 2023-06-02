<template>
    <div class="container">
        <Row>
            <Col :span="12"> <h3 :title="props.fieldName" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ props.fieldName }}</h3> </Col>
            <Col :span="12">
                <Row>
                    <select v-model="inputData.fieldSemanticTypes[props.fieldName]" @change="changeSemanticType">
                        <option value="nominal">类别类型</option>
                        <option value="quantitative">数值类型</option>
                        <option value="temporal">时序类型</option>
                    </select>
                    <select v-model="inputData.fieldAnalyticTypes[props.fieldName]" @change="changeAnalyticType">
                        <option value="dimension">维度</option>
                        <option value="measure">度量</option>
                    </select>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col :span="12"><Checkbox v-model:checked="fillEmpty">使用空值</Checkbox></Col>
            <Col :span="12">
                <Row>
                    <Col :span="12">替换为：</Col>
                    <Col :span="12" v-if="props.analyticType === 'measure'"><Input v-model:value.number="replaceValue" :disabled="!fillEmpty" :type="'number'" size="small"></Input></Col>
                    <Col :span="12" v-else><Input v-model:value="replaceValue" :disabled="!fillEmpty" :type="'text'" size="small"></Input></Col>
                </Row>
                
            </Col>
        </Row>
        <div class="chartArea">
            <TableHeadChart
                :datas="countDatas"
                :fieldName="props.fieldName"
                :semanticType="inputData.fieldSemanticTypes[props.fieldName]"
            ></TableHeadChart>
        </div>

        <div v-if="props.analyticType === 'measure'" class="info">
            <Row> <Col :span="12">计数</Col>       <Col :span="12">{{ getValueCount }}</Col></Row>
            <Row> <Col :span="12">唯一值数量</Col> <Col :span="12">{{ getUniqueCount }}</Col></Row>
            <Row> <Col :span="12">最大值</Col>     <Col :span="12">{{ getMax }}</Col></Row>
            <Row> <Col :span="12">最小值</Col>     <Col :span="12">{{ getMin }}</Col></Row>
            <Row> <Col :span="12">平均值</Col>     <Col :span="12">{{ getAverage.toFixed(6) }}</Col></Row>
            <Row> <Col :span="12">中位数</Col>     <Col :span="12">{{ getMidNum.toFixed(6) }}</Col></Row>
            <Row> <Col :span="12">标准差</Col>     <Col :span="12">{{ getStandardDeviation.toFixed(6) }}</Col></Row>
        </div>
        <div v-if="props.analyticType === 'dimension'" class="info">
            <Row> <Col :span="12">计数</Col>       <Col :span="12">{{ getValueCount }}</Col></Row>
            <Row> <Col :span="12">唯一值数量</Col> <Col :span="12">{{ getUniqueCount }}</Col></Row>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Row, Col, Select, Checkbox, Input } from "ant-design-vue";
import { onMounted, ref, computed, watch } from "vue";
import { AnalyticType } from "@/stores/types";
import useInputData from "@/stores/inputData";
import TableHeadChart from "./tableHeadChart.vue";
const fillEmpty = ref(false);
const inputData = useInputData();

const props = defineProps<{
    analyticType: AnalyticType,
    fieldName: string,
}>();

// 用于替换空值的值
const replaceValue = ref<number | string>(0);

watch([replaceValue, fillEmpty], () => {
    inputData.emptyCellPos[props.fieldName].pos.forEach((posIndex) => {
        if(fillEmpty.value === true) {
            inputData.inputData[posIndex][props.fieldName] = replaceValue.value;
        } else {
            inputData.inputData[posIndex][props.fieldName] = inputData.emptyCellPos[props.fieldName].originValue;
        }
    });
});

const countDatas = computed(() => {
    let map = new Map<number | string, number>();
    for(let value of inputData.inputData){
        let p = value[props.fieldName];
        if(map.has(p)) {
            let t = map.get(p);
            map.set(p, t + 1);
        } else {
            map.set(p, 1);
        }
    }
    let ans = [];
    for(let [key, count] of map.entries()){
        ans.push({key, count});
    }
    return ans;
});

onMounted(() => {
    if(props.analyticType !== "measure") replaceValue.value = "";
    else replaceValue.value = 0;
});

const getValueCount = computed(() => {
    const key = props.fieldName.toString();
    let ans = 0;
    for(let value of inputData.inputData) {
        if(value[key] !== null && value[key] !== undefined) {
            ans++;
        } else if (useNull.value === true) {
            ans++;
        }
    }
    return ans;
});

const getColDatas = computed(() => {
    let ans = [];
    for(let value of inputData.inputData){
        if(value[props.fieldName] !== null && value[props.fieldName] !== undefined){
            ans.push(value[props.fieldName]);
        } else if(useNull.value === true) {
            ans.push(replaceValue.value);
        }
    }
    return ans;
});

const getUniqueCount = computed(() => {
    return new Set(getColDatas.value).size;
});

const getMax = computed(() => {
    return Math.max(...getColDatas.value);
});

const getMin = computed(() => {
    return Math.min(...getColDatas.value);
});

const getAverage = computed(() => {
    let sum = getColDatas.value.reduce((pre, cur) => pre + cur);
    return sum / getColDatas.value.length;
});

const getMidNum = computed(() => {
    let newArr = [...getColDatas.value];
    let len = newArr.length;
    newArr.sort((a, b) => a - b);
    if(len % 2 === 1) {
        return newArr[Math.floor(len / 2)];
    } else {
        return (newArr[len / 2 - 1] + newArr[len / 2]) / 2;
    }
});

const getStandardDeviation = computed(() => {
    let avg = getAverage.value;
    let len = getColDatas.value.length;
    let stdDev = Math.sqrt(getColDatas.value.map(n=> (n-avg) * (n-avg)).reduce((pre, cur) => pre + cur) / len);
    return stdDev;
});


function changeAnalyticType(e: Event) {
    let value = (e.target as HTMLInputElement).value;
    console.log("changeAnalyticType", value);
}

function changeSemanticType(e: Event) {
    let value = (e.target as HTMLInputElement).value;
    console.log("changeSemanticType", value);
}
</script>

<style scoped lang="less">
    .container {
        padding: 5px;
        > .chartArea {
            display: flex;
            justify-content: center;
        }
        > .info {
            font-size: xx-small;
            text-align: center;
        }
    }
</style>