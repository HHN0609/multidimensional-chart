import { defineStore } from "pinia";
import { EmptyCellPosType, FieldAnalyticType, FieldSemanticType } from "@/stores/types";

export default defineStore("inputData", {
    state: () => {
        return {
            dataColumnNum: 0, // 数据的列数
            dataRowNum: 0, // 数据的总行数
            errorDataRows: 0, // 数据缺失的行数
            inputData: [] as any[], // 导入的数据
            fieldAnalyticTypes: {} as FieldAnalyticType,
            fieldSemanticTypes: {} as FieldSemanticType,
            emptyCellPos: {} as EmptyCellPosType // 空单元格的位置信息，用于填充
        }
    },
    getters: {
        getColDatas: (state) => {
            return (colName: string, useNull: boolean, replaceValue: number | string): any[] => {
                let ans = [];
                for(let value of state.inputData) {
                    if(value[colName] !== null && value[colName] !== undefined){
                        ans.push(value[colName]);
                    } else if(useNull === true) {
                        ans.push(replaceValue);
                    }
                }
                return ans;
            }
        },
    }
});

