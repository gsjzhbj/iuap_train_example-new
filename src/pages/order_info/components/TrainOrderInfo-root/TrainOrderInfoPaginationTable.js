import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { actions } from 'mirrorx';
import { Button,Message,Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import Header from 'components/Header';
import TrainOrderInfoForm from '../TrainOrderInfo-form';
import './index.less'
export default class TrainOrderInfoPaginationTable extends Component {
    constructor(props){
        super(props);
        let self=this;
        this.state = {
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            step: 10,
            showModal:false,
            delData:[],
            column:[
                {
                    title: "单据状态",
                    dataIndex: "billStatusEnum",
                    key: "billStatusEnum",
                    width:200,
                    render(text, record, index) {
                        if(text === '0'){
                            return '待确认';
                        }else if(text === '1'){
                            return '已确认';
                        }else{
                            return '';
                        }
                    }
                },
                {
                    title: "订单编号",
                    dataIndex: "orderNo",
                    key: "orderNo",
                     width:200,
                },
                {
                    title: "请购单位",
                    dataIndex: "orderOrgName",
                    key: "orderOrgName",
                    width:200,
                },
                {
                    title: "订单类型",
                    dataIndex: "orderTypeEnumValue",
                    key: "orderTypeEnumValue",
                     width:200,
                },
                {
                    title: "请购部门",
                    dataIndex: "orderDeptName",
                    key: "orderDeptName",
                     width:200,
                },
                {
                    title: "商品",
                    dataIndex: "orderGoods",
                    key: "orderGoods",
                     width:200,
                },
                {
                    title: "商品数量",
                    dataIndex: "orderGoodsCount",
                    key: "orderGoodsCount",
                     width:200,
                },
                {
                    title: "币种",
                    dataIndex: "currTypeName",
                    key: "currTypeName",
                     width:200,
                },
                {
                    title: "订单金额",
                    dataIndex: "orderAmount",
                    key: "orderAmount",
                     width:200,
                },
                {
                    title: "请购业务员",
                    dataIndex: "orderBusimanName",
                    key: "orderBusimanName",
                     width:200,
                },
                {
                    title: "请购时间",
                    dataIndex: "orderDate",
                    key: "orderDate",
                     width:200,
                },
                {
                    title: "采购计划日期",
                    dataIndex: "planDate",
                    key: "planDate",
                     width:200,
                },
                 {
                    title: "备注信息",
                    dataIndex: "remark",
                    key: "remark",
                     width:200,
                },
                {
                    title: "操作",
                    dataIndex: "d",
                    key: "d",
                    width:100,
                    fixed: "right",
                    render(text, record, index) {
                        return (
                            <div className='operation-btn'>
                                <i size='sm' className='uf uf-search edit-btn' onClick={() => { self.cellClick(record,2) }}></i>
                                <i size='sm' className='uf uf-pencil edit-btn' onClick={() => { self.cellClick(record,1) }}></i>
                                <i size='sm' className='uf uf-del del-btn' onClick={() => { self.delItem(record, index) }}></i>
                            </div>
                        )
                    }
                }
            ]
        }
    }
    
    componentDidMount(){
        // this.setState({ step: this.props.pageSize })
        actions.TrainOrderInfo.loadList();//table数据
    }

    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }
    /**
     * 编辑,详情，增加
     */

    cellClick = async (record,btnFlag) => {
        await actions.TrainOrderInfo.updateState({
            rowData : record,
        });

        let id = "";
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: 'TrainOrderInfo-edit',
                search:`?search_id=${id}&btnFlag=${btnFlag}`
            }
        )
    }

    // 删除操作
    delItem = (record, index) => {
        this.setState({
            showModal:true,
            delData:[{ id: record.id,ts: record.ts }]
        });

    }

    // 表格勾选回调函数，返回选中数据
    onTableSelectedData = data => {

        this.setState({
            selectData: data
        })
    }

    // 分页单页数据条数选择函数
    onPageSizeSelect = (index, value) => {
        actions.TrainOrderInfo.loadList({
            pageSize: value
        })
        actions.TrainOrderInfo.updateState({
            pageSize: value
        })
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = value => {
        actions.TrainOrderInfo.loadList({
            pageIndex: value
        })
        actions.TrainOrderInfo.updateState({
            pageIndex: value
        })
    }

    // 流程提交成功后回调函数
    onSubmitSuc = async ()=>{
        await actions.TrainOrderInfo.loadList();
        actions.TrainOrderInfo.updateState({showLoading:false});
        Message.create({content: '单据提交成功', color: 'success'});
        this.setState({
            selectData: data
        })
    }
    
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.TrainOrderInfo.updateState({showLoading:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.TrainOrderInfo.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.TrainOrderInfo.loadList();
        actions.TrainOrderInfo.updateState({showLoading:false});
        Message.create({content: '单据撤回成功', color: 'success'});
        this.setState({
            selectData: data
        })
    }

    // 撤回失败回调函数
    onRecallFail = (error)=>{
        actions.TrainOrderInfo.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }


    onSubmitEnd = () => {
        actions.TrainOrderInfo.updateState({ showLoading: false });
    }

    // 撤回操作执行起始函数,通常用于设置滚动条
    onRecallStart = ()=>{
        actions.TrainOrderInfo.updateState({showLoading:true});
    }

    // 查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.TrainOrderInfo.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'TrainOrderInfo-edit',
                detailObj: record,
            }
        )
    }

    // 模态框确认删除
    onModalDel = async (delFlag)=>{
        let {delData} = this.state;
        if(delFlag){
            await actions.TrainOrderInfo.delItem({
                param: delData
            });
        }
        this.setState({
            showModal:false,
            delData:[]
        })
    }


    // 动态设置列表滚动条x坐标
    getCloumnsScroll = (columns) => {
        let sum = 0;
        columns.forEach((da) => {
            sum += da.width;
        })
        return (sum);
    }
    // 修改数据
    changeData = ()=>{
        let {selectData} = this.state;
        if(selectData.length>0){
            
            actions.TrainOrderInfo.changeData({
                data:selectData
            });
        } else {
            Message.create({content: "请选择提交数据", color: 'danger'});
        }
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages , total } = this.props;
        let {selectData,showModal} = this.state;
        let exportProps = { total, pageIndex, pageSize, selectData, list};
        console.log("list",list)
        return (
            <div className='TrainOrderInfo-root'>
                <Header title='培训请购单'/>
                <TrainOrderInfoForm { ...this.props }/>
                <div className='table-header mt25'>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm' onClick={() => { self.cellClick({},0)}}>
                    新增
                    </Button>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm' onClick={() => { self.changeData() }}>
                    确认
                    </Button>


                </div>
                <PaginationTable
                        data={list}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        total = {total}
                        columns={this.state.column}
                        checkMinSize={6}
                        getSelectedDataFunc={this.tabelSelect}
                        onTableSelectedData={this.onTableSelectedData}
                        onPageSizeSelect={this.onPageSizeSelect}
                        onPageIndexSelect={this.onPageIndexSelect}
                />
                <Loading show={showLoading} loadingType="line" />
                <Modal
                        show={showModal}
                        onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>确认删除</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        是否删除选中内容
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>this.onModalDel(false)} shape="border" style={{ marginRight: 50 }}>关闭</Button>
                        <Button onClick={()=>this.onModalDel(true)} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )

    }
}