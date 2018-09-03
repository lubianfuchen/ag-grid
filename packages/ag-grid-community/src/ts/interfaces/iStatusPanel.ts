import {GridApi} from "../gridApi";
import {ColumnApi} from "../columnController/columnApi";
import {IComponent} from "./iComponent";

export type StatusPanelDef = {
    statusPanel?: {new(): IStatusPanelComp} | string,
    statusPanelFramework?: any,
    align?: string,
    key?: string,
    statusPanelParams?: {
        aggFuncs: string[];
    }
};

export interface IStatusPanelParams {
    api: GridApi;
    columnApi: ColumnApi;
    context: any;
}

export interface IStatusPanel {
}

export interface IStatusPanelComp extends IStatusPanel, IComponent<IStatusPanelParams> {
}

export interface IStatusBarItemFunc {
    (params: any): HTMLElement | string
}