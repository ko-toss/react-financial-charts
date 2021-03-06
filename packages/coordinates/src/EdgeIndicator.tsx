import { format } from "d3-format";
import * as React from "react";
import {
    first,
    functor,
    isDefined,
    getAxisCanvas,
    GenericChartComponent,
    last,
    noop,
    strokeDashTypes,
} from "@react-financial-charts/core";
import { drawOnCanvas } from "./EdgeCoordinateV3";

export interface EdgeIndicatorProps {
    readonly arrowWidth?: number;
    readonly displayFormat?: (n: number) => string;
    readonly edgeAt?: "left" | "right";
    readonly fill?: string | ((datum: any) => string);
    readonly fitToText?: boolean;
    readonly fontFamily?: string;
    readonly fontSize?: number;
    readonly fullWidth?: boolean;
    readonly itemType: "first" | "last";
    readonly lineStroke?: string | ((datum: any) => string);
    readonly lineStrokeDasharray?: strokeDashTypes;
    readonly orient?: "left" | "right";
    readonly rectHeight?: number;
    readonly rectWidth?: number;
    readonly stroke?: string | ((datum: any) => string);
    readonly textFill?: string | ((datum: any) => string);
    readonly type?: "horizontal";
    readonly yAccessor?: any; // func
    readonly yAxisPad?: number;
}

export class EdgeIndicator extends React.Component<EdgeIndicatorProps> {
    public static defaultProps = {
        type: "horizontal",
        fitToText: false,
        orient: "right",
        edgeAt: "right",
        textFill: "#FFFFFF",
        displayFormat: format(".2f"),
        yAxisPad: 0,
        rectHeight: 20,
        rectWidth: 50,
        arrowWidth: 0,
        fontFamily: "-apple-system, system-ui, Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
        fontSize: 13,
        dx: 0,
        hideLine: false,
        fill: "#8a8a8a",
        opacity: 1,
        stroke: noop,
        strokeOpacity: 1,
        strokeWidth: 1,
        lineStroke: "#000000",
        lineOpacity: 1,
        lineStrokeDasharray: "ShortDot",
    };

    public render() {
        return (
            <GenericChartComponent
                edgeClip
                clip={false}
                canvasDraw={this.drawOnCanvas}
                canvasToDraw={getAxisCanvas}
                drawOn={["pan"]}
            />
        );
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps: any) => {
        const edge = this.helper(this.props, moreProps);
        if (edge === null) {
            return;
        }

        const props = {
            ...this.props,
            ...edge,
        };

        drawOnCanvas(ctx, props);
    };

    private readonly helper = (props: EdgeIndicatorProps, moreProps: any) => {
        const { itemType, yAccessor } = props;
        const { plotData } = moreProps;

        const item = itemType === "first" ? first(plotData, yAccessor) : last(plotData, yAccessor);

        const edge = isDefined(item) ? this.getEdge(props, moreProps, item) : null;

        return edge;
    };

    private readonly getEdge = (props: EdgeIndicatorProps, moreProps: any, item: any) => {
        const {
            fontFamily,
            fontSize,
            type: edgeType,
            displayFormat = EdgeIndicator.defaultProps.displayFormat,
            edgeAt,
            yAxisPad = EdgeIndicator.defaultProps.yAxisPad,
            orient,
            lineStroke,
        } = props;

        const { yAccessor, fill, fullWidth, textFill, rectHeight, rectWidth, arrowWidth, stroke } = props;

        const {
            xScale,
            chartConfig: { yScale },
            xAccessor,
            width,
        } = moreProps;

        const yValue = yAccessor(item);
        const xValue = xAccessor(item);

        const x1 = fullWidth ? 0 : Math.round(xScale(xValue));
        const y1 = Math.round(yScale(yValue));

        const [left, right] = [0, width];
        const edgeX = edgeAt === "left" ? left - yAxisPad : right + yAxisPad;

        return {
            coordinate: displayFormat(yValue),
            show: true,
            type: edgeType,
            orient,
            edgeAt: edgeX,
            fill: functor(fill)(item),
            lineStroke: functor(lineStroke)(item),
            stroke: functor(stroke)(item),
            fontFamily,
            fontSize,
            textFill: functor(textFill)(item),
            rectHeight,
            rectWidth,
            arrowWidth,
            x1,
            y1,
            x2: right,
            y2: y1,
        };
    };
}
