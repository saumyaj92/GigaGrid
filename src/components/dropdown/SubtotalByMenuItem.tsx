import * as React from 'react';
import * as classNames from  'classnames';
import {GridSubcomponentProps} from "../TableHeaderCell";
import {Column} from "../../models/ColumnLike";
import {ColumnFormat} from "../../models/ColumnLike";
import SyntheticEvent = __React.SyntheticEvent;
import {NewSubtotalAction} from "../../store/GigaStore";
import {GigaActionType} from "../../store/GigaStore";
import {SimpleDropdownMenuItem} from "./DropdownMenu";

export interface SubtotalByMenuItemProps extends GridSubcomponentProps<SubtotalByMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:Column;
}

export class SubtotalByMenuItem extends React.Component<SubtotalByMenuItemProps, any> {

    constructor(props:SubtotalByMenuItemProps) {
        super(props);
    }

    private input:HTMLInputElement;

    private isNumericColumn():boolean {
        return this.props.tableRowColumnDef.format === ColumnFormat.NUMBER;
    }

    private onSubmit(e:SyntheticEvent) {
        const action:NewSubtotalAction = {
            type: GigaActionType.NEW_SUBTOTAL,
            subtotalBys: [{
                colTag: this.props.tableRowColumnDef.colTag
            }]
        };
        this.props.dispatcher.dispatch(action);
    }

    private onCancel(e:SyntheticEvent) {
        this.props.dispatcher.dispatch({
            type: GigaActionType.CLEAR_SUBTOTAL
        });
    }

    private renderAddSubtotal() {

        const cx = classNames({
            "dropdown-menu-item": true,
            "hoverable": !this.isNumericColumn()
        });

        const style = {
        };

        if (this.isNumericColumn())
            return [
                <div key={1} className={cx} style={style} onClick={e=>{e.preventDefault();e.stopPropagation();}}>
                    {this.renderForm()}
                </div>,
                <li key={2} className="dropdown-menu-item hoverable">
                    <i className="fa fa-plus"/>
                    &nbsp;
                    <span onClick={e=>this.onSubmit(e)}>Add Subtotal</span>
                </li>
            ];
        else
            return (
                [
                    <li key={1} onClick={e=>this.onSubmit(e)} className="dropdown-menu-item hoverable">
                        <i className="fa fa-plus"/>
                        &nbsp;
                        <span>Add Subtotal</span>
                    </li>
                ]
            );
    }

    private renderClearSubtotal() {
        return (
            <li onClick={e=>this.onCancel(e)} className="dropdown-menu-item hoverable">
                <i className="fa fa-ban"/>
                &nbsp;
                <span>Clear All Subtotal</span>
            </li>
        );
    }

    private renderForm() {
        return (
        <div>
            <div>
                Enter Buckets to Subtotal By
            </div>
            <input type="text" ref={(c)=>this.input=c} placeholder="ex: 1,3,5,7,9"/>
        </div>
        );
    }

    render() {
        return (
            <SimpleDropdownMenuItem text="Subtotal" isLastColumn={this.props.isLastColumn}>
                {this.renderAddSubtotal()}
                {this.renderClearSubtotal()}
            </SimpleDropdownMenuItem>
        );
    }
}