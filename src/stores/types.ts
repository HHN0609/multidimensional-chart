import { TimeUnit } from "vega";
export type MarkType = "circle" | "bar" | "line" | "scatter" | "area" | "arc" | "trail";
export type AggregateMethod = "sum" | "count" | "mean" | "min" | "max" | "median" | "variance" | "stdev" | "";
export type ListType = {
    fieldName: string,
    aggregateMethod?: AggregateMethod,
    id?: string,
    timeUnit?: TimeUnit
}
export type ChartData = {
    id: string,
    name: string,
    isAggregation: boolean,
    filters?: Map<string, Function[]>,
    markType: MarkType,
    color: ListType,
    size: ListType,
    opacity: ListType,
    shape: ListType,
    stack?: "normalize" | "" | "zero" | "center",
    X_axis: ListType[],
    Y_axis: ListType[],
    dimensionLists: ListType[],
    measureLists: ListType[],
    theme: string
};


export type AnalyticType = 'dimension' | 'measure';
export type SemanticType = 'quantitative' | 'nominal' | 'temporal';

export interface FieldAnalyticType {
    [key: string]: AnalyticType
};

export interface FieldSemanticType {
    [key: string]: SemanticType
};

export interface EmptyCellPosType {
    [key: string]: {
        originValue: any,
        pos: number[]
    }
}