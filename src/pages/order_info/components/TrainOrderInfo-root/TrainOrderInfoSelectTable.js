import React, { Component } from 'react';
import { Button,Checkbox,Table } from 'tinper-bee';
import moment from "moment/moment";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Header from 'components/Header';
import TrainOrderInfoForm from '../TrainOrderInfo-form';
const MultiSelectTable = multiSelect(Table, Checkbox);

export default class TrainOrderInfoSelectTable extends Component {
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
                    title: "订单类型",
                    dataIndex: "orderType",
                    key: "orderType",
                    width: 100,
                },
                {
                    title: "请购部门",
                    dataIndex: "orderDeptName",
                    key: "orderDeptName",
                    width: 100,
                },
                {
                    title: "订单编号",
                    dataIndex: "orderNo",
                    key: "orderNo",
                    width: 100,
                },
                {
                    title: "商品数量",
                    dataIndex: "orderGoodsCount",
                    key: "orderGoodsCount",
                    width: 100,
                },
                {
                    title: "币种",
                    dataIndex: "currType",
                    key: "currType",
                    width: 100,
                },
                {
                    title: "商品",
                    dataIndex: "orderGoods",
                    key: "orderGoods",
                    width: 100,
                },
                {
                    title: "备注信息",
                    dataIndex: "remark",
                    key: "remark",
                    width: 100,
                },
                {
                    title: "请购业务员",
                    dataIndex: "orderBusimanName",
                    key: "orderBusimanName",
                    width: 100,
                },
                {
                    title: "采购计划日期",
                    dataIndex: "planDate",
                    key: "planDate",
                    width: 100,
                },
                {
                    title: "订单金额",
                    dataIndex: "orderAmount",
                    key: "orderAmount",
                    width: 100,
                },
                {
                    title: "请购单位",
                    dataIndex: "orderOrgName",
                    key: "orderOrgName",
                    width: 100,
                },
                {
                    title: "币种",
                    dataIndex: "currTypeName",
                    key: "currTypeName",
                    width: 100,
                },
                {
                    title: "请购时间",
                    dataIndex: "orderDate",
                    key: "orderDate",
                    width: 100,
                },
                {
                    title: "请购业务员",
                    dataIndex: "orderBusiman",
                    key: "orderBusiman",
                    width: 100,
                },
                {
                    title: "订单名称",
                    dataIndex: "orderName",
                    key: "orderName",
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
            <div className="TrainOrderInfo-select-table">
                <Header title='培训请购单' back={true} />
                <TrainOrderInfoForm { ...this.props }/>
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