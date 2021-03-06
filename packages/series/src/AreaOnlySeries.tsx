import { first, functor, getAxisCanvas, GenericChartComponent } from "@react-financial-charts/core";
import { ScaleContinuousNumeric } from "d3-scale";
import { area as d3Area, CurveFactory } from "d3-shape";
import * as React from "react";

export interface AreaOnlySeriesProps {
    readonly base?:
        | number
        | ((yScale: ScaleContinuousNumeric<number, number>, d: [number, number], moreProps: any) => number);
    readonly canvasClip?: (context: CanvasRenderingContext2D, moreProps: any) => void;
    /**
     * The default accessor for defined returns not NaN, thus assumes that the input data is always a number.
     */
    readonly defined?: (data: number) => boolean;
    /**
     * Color, gradient, or pattern to use for fill.
     */
    readonly fillStyle?: string | CanvasGradient | CanvasPattern;
    /**
     * A factory for a curve generator for the area.
     */
    readonly interpolation?: CurveFactory;
    /**
     * Selector for data to plot.
     */
    readonly yAccessor: (data: any) => number;
}

export class AreaOnlySeries extends React.Component<AreaOnlySeriesProps> {
    public static defaultProps = {
        defined: (d: number) => !isNaN(d),
        base: (yScale: ScaleContinuousNumeric<number, number>) => first(yScale.range()),
    };

    public render() {
        return <GenericChartComponent canvasDraw={this.drawOnCanvas} canvasToDraw={getAxisCanvas} drawOn={["pan"]} />;
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps: any) => {
        const {
            fillStyle,
            interpolation,
            canvasClip,
            yAccessor,
            defined = AreaOnlySeries.defaultProps.defined,
            base,
        } = this.props;

        const {
            xScale,
            chartConfig: { yScale },
            plotData,
            xAccessor,
        } = moreProps;

        if (canvasClip !== undefined) {
            ctx.save();
            canvasClip(ctx, moreProps);
        }

        if (fillStyle !== undefined) {
            ctx.fillStyle = fillStyle;
        }

        ctx.beginPath();
        const newBase = functor(base);
        const areaSeries = d3Area()
            .defined((d) => defined(yAccessor(d)))
            .x((d) => Math.round(xScale(xAccessor(d))))
            .y0((d) => newBase(yScale, d, moreProps))
            .y1((d) => Math.round(yScale(yAccessor(d))))
            .context(ctx);

        if (interpolation !== undefined) {
            areaSeries.curve(interpolation);
        }
        areaSeries(plotData);
        ctx.fill();

        if (canvasClip) {
            ctx.restore();
        }
    };
}
