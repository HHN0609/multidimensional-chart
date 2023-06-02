<template>
    <div class="container">
        <div class="uploadArea">
            <input
                type="file"
                accept=".xls,.xlsx,.csv,.json"
                @change="readDataFile($event)"
            />
            <span> 输入数据规模: {{ inputData.dataRowNum }}行 X {{ inputData.dataColumnNum }}列，</span>
            <span>部分数据缺失行数：{{ inputData.errorDataRows }}行</span>
        </div>
        <div class="tableContainer">
            <Table
                class="ant-table-striped"
                :dataSource="inputData.inputData" 
                :columns="columnsType"
                :scroll="{ y: 700 }"
                :pagination="false"
                bordered
                :rowClassName="rowColor"
            >
                <template #headerCell="{ column }">
                  <tableHeadCard
                      :fieldName="column.title"
                      :analyticType="inputData.fieldAnalyticTypes[column.title]"
                  ></tableHeadCard>
                </template>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Table, message } from "ant-design-vue";
import { computed } from "vue";
import useInputData from "@/stores/inputData";
import useChartData from "@/stores/chartData";
import tableHeadCard from "@/components/dataTable/tableHeadCard.vue";
import { isDateTime, isEmptyCell, sampleData } from "@/utils";
import { FileReader } from "@kanaries/web-data-loader";
import { isNumeric } from "vega-lite";

const inputData = useInputData();
const chartData = useChartData();

const columnsType = computed<any>(() => {
    let ans: any[] = [];
    if(inputData.inputData.length === 0) return ans;
    // 进行数据采样
    let luckyRow = sampleData(inputData.inputData, 5);
    console.log("luckyRow", luckyRow);
    for(let key of Object.keys(luckyRow)){
        ans.push({
            title: key,
            dataIndex: key,
            key: key,
            width: 250
        });

        // 字段analyticType和semanticType判断
        if(key.toLowerCase() === "year" || key.toLowerCase() === "month") {
            inputData.fieldAnalyticTypes[key] = "dimension";
            inputData.fieldSemanticTypes[key] = "temporal";
            continue;
        }

        if(typeof luckyRow[key] === "number") {
            inputData.fieldAnalyticTypes[key] = "measure";
            inputData.fieldSemanticTypes[key] = "quantitative";
        } else {
            inputData.fieldAnalyticTypes[key] = "dimension";
            if(isDateTime(luckyRow[key])) {
              inputData.fieldSemanticTypes[key] = "temporal";
            } else {
              inputData.fieldSemanticTypes[key] = "nominal";
            }
        }
    }
    return ans;
});

// table颜色变化
function rowColor(_record: any, index: number): string | null {
  for(let key in _record) {
    if(isEmptyCell(_record[key])){
      // inputData.errorDataRows++;
      return 'table-warn';
    }
  }
  return index % 2 === 1 ? 'table-striped' : null;
}

function readDataFile(ev) {
  const file = ev.target.files[0];
  if(ev.target.files.length === 0) return;
  clearState();
  if (!/\.(xls|xlsx|csv|json)$/.test(file.name.toLowerCase())) {
    message.warn("Format error");
    return;
  }
  if(/^.*\.json$/.test(file.name.toLowerCase())) {
    file.text().then((value) => {
      let datas = JSON.parse(value);
      let keys = Object.keys(datas[0]);
      inputData.dataRowNum = datas.length;
      inputData.dataColumnNum = keys.length;
      inputData.inputData.push(...datas);
    });
    return;
  }
  FileReader.csvReader({
    file: file,
    config: {
      size: 400,
      type: "reservoirSampling"
    }
  }).then((datas: any[]) => {
    let keys = Object.keys(datas[0]);
    
    keys.forEach((key) => {
      let flag = datas.every((value) => {
        return isEmptyCell(value[key]) || isNumeric(value[key]);
      });
      // console.log(key, flag);
      if(flag) {
        datas.forEach(value => {
          if(isEmptyCell(value[key])) {
            value[key] = 0;
            return;
          }
          value[key] = Number(value[key]);
        });
      }
    });

    inputData.dataRowNum = datas.length;
    inputData.dataColumnNum = keys.length;
    collectEmptyPos(datas);
    inputData.inputData.push(...datas);
    return;
  });
}

// 收集空单元格的位置信息
function collectEmptyPos(datas: any[]) {
  let keys = Object.keys(datas[0]);
  for(let key of keys) {
    // 初始化记录空单元格的数据结构
    inputData.emptyCellPos[key] = {
      originValue: "",
      pos: []
    };
    datas.forEach((data, index) => {
      if(isEmptyCell(data[key])) {
        // 遇到了这一列第一个空值，记录下来空值的值
        if(inputData.emptyCellPos[key].pos.length === 0) {
          inputData.emptyCellPos[key].originValue = data[key];
        }
        inputData.emptyCellPos[key].pos.push(index);
      }
    })
  }
}

function clearState() {
  inputData.$reset();
  chartData.$reset();
}

</script>

<style scoped lang="less">
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .uploadArea {
        width: 100%;
        height: fit-content;
        padding: 5px;
        border: 1px solid black;
    }
    .tableContainer {
        flex-grow: 1;
        overflow-x: hidden;
        overflow-y: auto;
        // padding: 5px;
        > .ant-table-striped {
          width: fit-content;
        }
        // 修改单元格的padding
        .ant-table-striped :deep(.ant-table-cell) {
          padding: 5px;
        }
        .ant-table-striped :deep(.table-striped) td {
          background-color: #fafafa;
        }
        .ant-table-striped :deep(.table-warn) td {
          background-color: #FFF2E8;
        }
    }
}
</style>