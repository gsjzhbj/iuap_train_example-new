import React, { Component } from 'react';
import { Button,Checkbox,Table } from 'tinper-bee';
import moment from "moment/moment";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Header from 'components/Header';
import Arrive_orderForm from '../arrive_order-form';
const MultiSelectTable = multiSelect(Table, Checkbox);

export default class Arrive_orderSelectTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectData:[]
        }
    }
    /**
     * 编辑
     */
    edit = () =>{
        console.log('进入编辑');
    }
    /**
     * tabel选中数据
     * @param {*} data
     */
    tabelSelect = (data) => {
        this.setState({
            selectData: data
        })
    }
    render(){
        const self=this;
        const { list,showLoading,pageSize, pageIndex, totalPages } = this.props;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 100,
                render(record, text, index) {
                    return index + 1;
                }
            },
                {
                    title: "备注",
                    dataIndex: "note",
                    key: "note",
                    width: 100,
                },
                {
                    title: "数量",
                    dataIndex: "total",
                    key: "total",
                    width: 100,
                },
                {
                    title: "收货人",
                    dataIndex: "receiver",
                    key: "receiver",
                    width: 100,
                },
                {
                    title: "供应商",
                    dataIndex: "supplier",
                    key: "supplier",
                    width: 100,
                },
                {
                    title: "到货时间",
                    dataIndex: "receive_time",
                    key: "receive_time",
                    width: 100,
                },
                {
                    title: "单据号",
                    dataIndex: "billcode",
                    key: "billcode",
                    width: 100,
                },
                {
                    title: "退货",
                    dataIndex: "isback",
                    key: "isback",
                    width: 100,
                },
                {
                    title: "库存组织",
                    dataIndex: "pk_org",
                    key: "pk_org",
                    width: 100,
                },
            {
                title: "操作",
                dataIndex: "e",
                key: "e",
                render(text, record, index) {
                    return (
                        <div className='operation-btn'>
                            <Button size='sm' className='edit-btn' onClick={() => { self.edit(record,true) }}>编辑</Button>
                        </div>
                    )
                }
            }
        ];
        return (
            <div className="arrive_order-select-table">
                <Header title='到货单' back={true} />
                <Arrive_orderForm { ...this.props }/>
                <div className="table-list">
                    <MultiSelectTable
                        loading={{ show: showLoading, loadingType: "line" }}
                        rowKey={(r, i) => i}
                        columns={column}
                        data={list}
                        multiSelect={{ type: "checkbox" }}
                        getSelectedDataFunc={this.tabelSelect}
                    />
                </div>
            </div>
        )
    }
}