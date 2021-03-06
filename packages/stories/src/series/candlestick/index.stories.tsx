import * as React from "react";
import { CandlestickSeries } from "../../../../series/src/CandlestickSeries";
import { Daily, Intraday } from "./basicCandlestick";

export default {
    component: CandlestickSeries,
    title: "Visualization/Series/Candles",
};

export const daily = () => <Daily />;

export const intraday = () => <Intraday />;
