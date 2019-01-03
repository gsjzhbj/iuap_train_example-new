import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Table,Button } from 'tinper-bee'
import moment from "moment/moment";

import './index.less'

// Arrive_orderTable 组件定义
class Arrive_orderTable extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    /**
     * 编辑,详情，增加
     */
    cellClick = async(record, editFlag) => {

        // 新增、编辑、查看时,先清空子表数据
        await actions.mastertable.updateState({
            childListmaterial:[],
            cacheArraymaterial:[],
        })

        actions.routing.push(
            {
                pathname: 'arrive_order-edit',
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.arrive_order.delItem({
            param: [{ id: record.id,ts: record.ts }],
            index: index
        });
    }
    /**
     *
     */
    render(){
        const self = this;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 80,
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
                            <Button size='sm' className='edit-btn' onClick={() => { self.cellClick(record, true) }}>编辑</Button>
                            <Button size='sm' className='del-btn' onClick={() => { self.delItem(record, index) }}>删除</Button>
                        </div>
                    )
                }
            }
        ];
        const { list,showLoading,pageSize, pageIndex, totalPages, } = this.props;
        return (
            <div className="table-list">
                <div className='table-header'>
                    <Button
                        size="sm"
                        colors="primary"
                        shape="border"
                        onClick={() => { self.cellClick({}, true) }}>
                        新增
                    </Button>
                </div>
                <Table
                    loading={{show:showLoading,loadingType:"line"}}
                    rowKey={(r,i)=>i}
                    columns={column}
                    data={list}
                />
            </div>
        )
    }
}

export default Arrive_orderTable