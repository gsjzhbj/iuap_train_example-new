import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { actions } from 'mirrorx';
import { Button,Message,Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import Header from 'components/Header';
import Arrive_orderForm from '../arrive_order-form';
import AcExport from '../arrive_order-export';
import AcUpload from 'ac-upload';
import 'ac-upload/build/ac-upload.css';
import './index.less'
export default class Arrive_orderPaginationTable extends Component {
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
                    title: "库存组织",
                    dataIndex: "pk_org",
                    key: "pk_org",
                     width:200,
                },
                {
                    title: "供应商",
                    dataIndex: "supplier",
                    key: "supplier",
                     width:200,
                },
                {
                    title: "收货人",
                    dataIndex: "receiver",
                    key: "receiver",
                     width:200,
                },
                {
                    title: "到货时间",
                    dataIndex: "receive_time",
                    key: "receive_time",
                     width:200,
                },
                {
                    title: "退货",
                    dataIndex: "isback",
                    key: "isback",
                     width:200,
                     render: (text, record, index) => text ? text === "1" ? "是" : "否" : ''
                },
                {
                    title: "单据号",
                    dataIndex: "billcode",
                    key: "billcode",
                     width:200,
                },
                {
                    title: "数量",
                    dataIndex: "numtotal",
                    key: "numtotal",
                     width:200,
                },

                {
                    title: "备注",
                    dataIndex: "note",
                    key: "note",
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
        actions.arrive_order.loadList();//table数据
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
        await actions.arrive_order.updateState({
            rowData : record,
        });

        let id = "";
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: 'arrive_order-edit',
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
        actions.arrive_order.loadList({
            pageSize: value
        })
        actions.arrive_order.updateState({
            pageSize: value
        })
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = value => {
        actions.arrive_order.loadList({
            pageIndex: value
        })
        actions.arrive_order.updateState({
            pageIndex: value
        })
    }

    // 流程提交成功后回调函数
    onSubmitSuc = async ()=>{
        await actions.arrive_order.loadList();
        actions.arrive_order.updateState({showLoading:false});
        Message.create({content: '单据提交成功', color: 'success'});
        this.setState({
            selectData: data
        })
    }
    
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.arrive_order.updateState({showLoading:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.arrive_order.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.arrive_order.loadList();
        actions.arrive_order.updateState({showLoading:false});
        Message.create({content: '单据撤回成功', color: 'success'});
        this.setState({
            selectData: data
        })
    }

    // 撤回失败回调函数
    onRecallFail = (error)=>{
        actions.arrive_order.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }


    onSubmitEnd = () => {
        actions.arrive_order.updateState({ showLoading: false });
    }

    // 撤回操作执行起始函数,通常用于设置滚动条
    onRecallStart = ()=>{
        actions.arrive_order.updateState({showLoading:true});
    }

    // 查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.arrive_order.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'arrive_order-edit',
                detailObj: record,
            }
        )
    }

    // 模态框确认删除
    onModalDel = async (delFlag)=>{
        let {delData} = this.state;
        if(delFlag){
            await actions.arrive_order.delItem({
                param: delData
            });
        }
        this.setState({
            showModal:false,
            delData:[]
        })
    }
    // 模板下载
    onLoadTemplate = () => {
        window.open(`${GROBAL_HTTP_CTX}/arrive_order/excelTemplateDownload`)
    }

    // 导入成功回调函数
    handlerUploadSuccess = (data)=>{
        // 导入成功后，列表加载数据
        Message.create({content: '导入数据成功', color: 'success'});
        actions.arrive_order.loadList();
    }

    // 导入删除回调函数
    handlerUploadDelete = (file) => {

    }

    // 导出
    exportExcel = () =>{
        //actions.arrive_order.exportExcel(this.queryParams);
        let { selectData } = this.state;
        if(selectData.length > 0) {
            actions.arrive_order.exportExcel({
                dataList : selectData
            });
        }else {
            Message.create({ content: '请选择导出数据', color : 'danger'  });
        }
    }


    // 动态设置列表滚动条x坐标
    getCloumnsScroll = (columns) => {
        let sum = 0;
        columns.forEach((da) => {
            sum += da.width;
        })
        return (sum);
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages , total } = this.props;
        let {selectData,showModal} = this.state;
        let exportProps = { total, pageIndex, pageSize, selectData, list};
        console.log("list",list)
        return (
            <div className='arrive_order-root'>
                <Header title='到货单'/>
                <Arrive_orderForm { ...this.props }/>
                <div className='table-header mt25'>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm' onClick={() => { self.cellClick({},0) }}>
                    新增
                    </Button>
                    <BpmButtonSubmit
                            className="ml5 "
                            checkedArray = {selectData}
                            funccode = "arriveorder"
                            nodekey = "003"
                            url = {`${GROBAL_HTTP_CTX}/arrive_order/submit`}
                            urlAssignSubmit={`${GROBAL_HTTP_CTX}/arrive_order/assignSubmit`}
                            onSuccess = {this.onSubmitSuc}
                            onError = {this.onSubmitFail}
                            onStart={this.onSubmitStart}
                            onEnd={this.onSubmitEnd}
                    >
                        <Button size='sm' style={{"marginLeft":"15px"}} className="admin"  colors="primary">提交</Button>
                    </BpmButtonSubmit>
                    <BpmButtonRecall
                            className="ml5 "
                            checkedArray = {selectData}
                            url = {`${GROBAL_HTTP_CTX}/arrive_order/recall`}
                            onSuccess = {this.onRecallSuc}
                            onError = {this.onRecallFail}
                            onStart = {this.onRecallStart}
                            onEnd={this.onSubmitEnd}
                    >
                        <Button size='sm' style={{"marginLeft":"15px"}} className="admin"  colors="primary">收回</Button>
                    </BpmButtonRecall>
                   


                    {/* <Button colors="primary" className="ml5" size='sm' onClick={ self.onLoadTemplate}>模板下载</Button> */}
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