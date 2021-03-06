import { ScaleContinuousNumeric } from "d3-scale";
export {
    default as discontinuousTimeScaleProvider,
    discontinuousTimeScaleProviderBuilder,
} from "./discontinuousTimeScaleProvider";
export { default as financeDiscontinuousScale } from "./financeDiscontinuousScale";

export const defaultScaleProvider = (xScale: ScaleContinuousNumeric<number, number>) => {
    return (data: any, xAccessor: any) => ({ data, xScale, xAccessor, displayXAccessor: xAccessor });
};
