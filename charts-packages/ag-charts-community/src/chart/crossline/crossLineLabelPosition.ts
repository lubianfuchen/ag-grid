export type CrossLineLabelPosition =
    'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'inside'
    | 'insideLeft'
    | 'insideRight'
    | 'insideTop'
    | 'insideBottom'
    | 'insideTopLeft'
    | 'insideBottomLeft'
    | 'insideTopRight'
    | 'insideBottomRight';

export interface Point {
    readonly x: number;
    readonly y: number;
}

type CoordinatesFnOpts = { yDirection: boolean, xStart: number, xEnd: number, yStart: number, yEnd: number, padding?: number, position: CrossLineLabelPosition }

type CoordinatesFn = (
    { yDirection, xStart, xEnd, yStart, yEnd, padding, position }: CoordinatesFnOpts
) => Point;

type TextAlignFn = (labelRotation: number) => CanvasTextAlign;

type TextBaselineFn = (labelRotation: number) => CanvasTextBaseline;

type PositionCalcFns = {
    c: CoordinatesFn;
    a: TextAlignFn;
    b: TextBaselineFn;
};

type LabelPaddingDirection = 1 | -1 | 0;
type CrossLinePaddingDirection = { xPaddingDirection: LabelPaddingDirection, yPaddingDirection: LabelPaddingDirection };

const horizontalCrosslinePaddingDirections: Record<CrossLineLabelPosition, CrossLinePaddingDirection> = {
    top: { xPaddingDirection: 0, yPaddingDirection: -1 },
    bottom: { xPaddingDirection: 0, yPaddingDirection: 1 },
    left: { xPaddingDirection: -1, yPaddingDirection: 0 },
    right: { xPaddingDirection: 1, yPaddingDirection: 0 },
    inside: { xPaddingDirection: 0, yPaddingDirection: 0 },
    insideLeft: { xPaddingDirection: 1, yPaddingDirection: 0 },
    insideRight: { xPaddingDirection: -1, yPaddingDirection: 0 },
    insideTop: { xPaddingDirection: 0, yPaddingDirection: 1 },
    insideBottom: { xPaddingDirection: 0, yPaddingDirection: -1 },
    insideTopLeft: { xPaddingDirection: 1, yPaddingDirection: 1 },
    insideBottomLeft: { xPaddingDirection: 1, yPaddingDirection: -1 },
    insideTopRight: { xPaddingDirection: -1, yPaddingDirection: 1 },
    insideBottomRight: { xPaddingDirection: -1, yPaddingDirection: -1 },
}

const verticalCrossLinePaddingDirections: Record<CrossLineLabelPosition, CrossLinePaddingDirection> = {
    top: { xPaddingDirection: 1, yPaddingDirection: 0 },
    bottom: { xPaddingDirection: -1, yPaddingDirection: 0 },
    left: { xPaddingDirection: 0, yPaddingDirection: -1 },
    right: { xPaddingDirection: 0, yPaddingDirection: 1 },
    inside: { xPaddingDirection: 0, yPaddingDirection: 0 },
    insideLeft: { xPaddingDirection: 0, yPaddingDirection: 1 },
    insideRight: { xPaddingDirection: 0, yPaddingDirection: -1 },
    insideTop: { xPaddingDirection: -1, yPaddingDirection: 0 },
    insideBottom: { xPaddingDirection: 1, yPaddingDirection: 0 },
    insideTopLeft: { xPaddingDirection: -1, yPaddingDirection: 1 },
    insideBottomLeft: { xPaddingDirection: 1, yPaddingDirection: 1 },
    insideTopRight: { xPaddingDirection: -1, yPaddingDirection: -1 },
    insideBottomRight: { xPaddingDirection: 1, yPaddingDirection: -1 },
}

const calculateLabelPadding = ({ yDirection, padding = 0, position }: { yDirection: boolean, padding: number, position: CrossLineLabelPosition }): { xPadding: number, yPadding: number } => {
    const crossLinePaddingDirections = yDirection ? horizontalCrosslinePaddingDirections : verticalCrossLinePaddingDirections;
    const { xPaddingDirection, yPaddingDirection } = crossLinePaddingDirections[position] ?? crossLinePaddingDirections['top'];
    const xPadding = xPaddingDirection * padding;
    const yPadding = yPaddingDirection * padding;
    return {
        xPadding,
        yPadding
    }
}

export const POSITION_TOP_COORDINATES: CoordinatesFn = ({ yDirection, xEnd, yStart, yEnd, padding = 0, position = 'top' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    if (yDirection) {
        return { x: (xEnd / 2) + xPadding, y: (!isNaN(yEnd) ? yEnd : yStart) + yPadding }
    } else {
        return { x: xEnd + xPadding, y: (!isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart) + yPadding }
    }
}

export const POSITION_LEFT_COORDINATES: CoordinatesFn = ({ yDirection, xStart, xEnd, yStart, yEnd, padding = 0, position = 'left' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    if (yDirection) {
        return { x: xStart + xPadding, y: (!isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart) + yPadding }
    } else {
        return { x: (xEnd / 2) + xPadding, y: yStart + yPadding }
    }
}

export const POSITION_RIGHT_COORDINATES: CoordinatesFn = ({ yDirection, xEnd, yStart, yEnd, padding = 0, position = 'right' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    if (yDirection) {
        return { x: xEnd + xPadding, y: (!isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart) + yPadding }
    } else {
        return { x: (xEnd / 2) + xPadding, y: (!isNaN(yEnd) ? yEnd : yStart) + yPadding }
    }
}

export const POSITION_BOTTOM_COORDINATES: CoordinatesFn = ({ yDirection, xStart, xEnd, yStart, yEnd, padding = 0, position = 'bottom' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    if (yDirection) {
        return { x: (xEnd / 2) + xPadding, y: yStart + yPadding }
    } else {
        return { x: xStart + xPadding, y: (!isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart) + yPadding }
    }
}

export const POSITION_INSIDE_COORDINATES: CoordinatesFn = ({ xEnd, yStart, yEnd }) => {
    return { x: xEnd / 2, y: !isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart }
}

export const POSITION_INSIDE_TOP_LEFT_COORDINATES: CoordinatesFn = ({ yDirection, xStart, xEnd, yStart, yEnd, padding = 0, position = 'insideTopLeft' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    if (yDirection) {
        return { x: (xStart / 2) + xPadding, y: (!isNaN(yEnd) ? yEnd : yStart) + yPadding }
    } else {
        return { x: xEnd + xPadding, y: yStart + yPadding }
    }
}

export const POSITION_INSIDE_BOTTOM_LEFT_COORDINATES: CoordinatesFn = ({ yDirection, xStart, yStart, padding = 0, position = 'insideBottomLeft' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    return { x: xStart + xPadding, y: yStart + yPadding }
}

export const POSITION_INSIDE_TOP_RIGHT_COORDINATES: CoordinatesFn = ({ yDirection, xEnd, yStart, yEnd, padding = 0, position = 'insideTopRight' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    return { x: xEnd + xPadding, y: (!isNaN(yEnd) ? yEnd : yStart) + yPadding }
}

export const POSITION_INSIDE_BOTTOM_RIGHT_COORDINATES: CoordinatesFn = ({ yDirection, xStart, xEnd, yStart, yEnd, padding = 0, position = 'insideBottomRight' }) => {
    const { xPadding, yPadding } = calculateLabelPadding({yDirection, padding, position});
    if (yDirection) {
        return { x: xEnd + xPadding, y: yStart + yPadding }
    } else {
        return { x: xStart + xPadding, y: (!isNaN(yEnd) ? yEnd : yStart) + yPadding }
    }
}

export const POSITION_LEFT_TEXT_ALIGN: TextAlignFn = (labelRotation) => labelRotation ? 'center' : 'end'
export const POSITION_RIGHT_TEXT_ALIGN: TextAlignFn = (labelRotation) => labelRotation ? 'center' : 'start'
export const POSITION_TOP_TEXT_ALIGN: TextAlignFn = (labelRotation) => labelRotation ? 'start' : 'center'
export const POSITION_BOTTOM_TEXT_ALIGN: TextAlignFn = (labelRotation) => labelRotation ? 'end' : 'center'
export const POSITION_INSIDE_TEXT_ALIGN: TextAlignFn = (labelRotation) => 'center'

export const POSITION_TOP_TEXT_BASELINE: TextBaselineFn = (labelRotation) => labelRotation ? 'middle' : 'bottom'
export const POSITION_BOTTOM_TEXT_BASELINE: TextBaselineFn = (labelRotation) => labelRotation ? 'middle' : 'top'
export const POSITION_LEFT_TEXT_BASELINE: TextBaselineFn = (labelRotation) => labelRotation ? 'top' : 'middle'
export const POSITION_INSIDE_TEXT_BASELINE: TextBaselineFn = (labelRotation) => 'middle'

export const labeldDirectionHandling: Record<CrossLineLabelPosition, PositionCalcFns> = {
    top: { c: POSITION_TOP_COORDINATES, a: POSITION_TOP_TEXT_ALIGN, b: POSITION_TOP_TEXT_BASELINE },
    bottom: { c: POSITION_BOTTOM_COORDINATES, a: POSITION_BOTTOM_TEXT_ALIGN, b: POSITION_BOTTOM_TEXT_BASELINE },
    left: { c: POSITION_LEFT_COORDINATES, a: POSITION_LEFT_TEXT_ALIGN, b: POSITION_LEFT_TEXT_BASELINE },
    right: { c: POSITION_RIGHT_COORDINATES, a: POSITION_RIGHT_TEXT_ALIGN, b: POSITION_LEFT_TEXT_BASELINE },
    inside: { c: POSITION_INSIDE_COORDINATES, a: POSITION_INSIDE_TEXT_ALIGN, b: POSITION_INSIDE_TEXT_BASELINE },
    insideLeft: { c: POSITION_LEFT_COORDINATES, a: POSITION_RIGHT_TEXT_ALIGN, b: POSITION_LEFT_TEXT_BASELINE },
    insideRight: { c: POSITION_RIGHT_COORDINATES, a: POSITION_LEFT_TEXT_ALIGN, b: POSITION_LEFT_TEXT_BASELINE },
    insideTop: { c: POSITION_TOP_COORDINATES, a: POSITION_TOP_TEXT_ALIGN, b: POSITION_BOTTOM_TEXT_BASELINE },
    insideBottom: { c: POSITION_BOTTOM_COORDINATES, a: POSITION_BOTTOM_TEXT_ALIGN, b: POSITION_TOP_TEXT_BASELINE },
    insideTopLeft: { c: POSITION_INSIDE_TOP_LEFT_COORDINATES, a: POSITION_RIGHT_TEXT_ALIGN, b: POSITION_BOTTOM_TEXT_BASELINE },
    insideBottomLeft: { c: POSITION_INSIDE_BOTTOM_LEFT_COORDINATES, a: POSITION_RIGHT_TEXT_ALIGN, b: POSITION_TOP_TEXT_BASELINE },
    insideTopRight: { c: POSITION_INSIDE_TOP_RIGHT_COORDINATES, a: POSITION_LEFT_TEXT_ALIGN, b: POSITION_BOTTOM_TEXT_BASELINE },
    insideBottomRight: { c: POSITION_INSIDE_BOTTOM_RIGHT_COORDINATES, a: POSITION_LEFT_TEXT_ALIGN, b: POSITION_TOP_TEXT_BASELINE },
}