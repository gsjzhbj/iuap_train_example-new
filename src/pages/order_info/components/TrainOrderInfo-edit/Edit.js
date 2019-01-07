import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
import { Switch, InputNumber,Loading, Table, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message } from "tinper-bee";
import Radio from 'bee-radio';
import Header from "components/Header";
import options from "components/RefOption";
import DatePicker from 'bee-datepicker';
import Form from 'bee-form';
import Select from 'bee-select';
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import moment from "moment";
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './edit.less';
import 'ac-upload/build/ac-upload.css';
import { setCookie, getCookie} from "utils";

const FormItem = Form.FormItem;
const Option = Select.Option;
const format = "YYYY-MM-DD";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                refKeyArrayorderOrg:[],
                refKeyArraycurrType:[],
                refKeyArrayorderDept:[],
                refKeyArrayorderBusiman:[],
                planDateDisabled: true,
            fileNameData: props.rowData.attachment || [],//上传附件数据
        }
        
    }
    async componentWillMount() {
        await actions.TrainOrderInfo.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.TrainOrderInfo.queryDetail({ search_id });
            let rowData = this.handleRefShow(tempRowData) || {};

            console.log('rowData',rowData);
            this.setState({
                rowData:rowData,
            })
        }else{
            let orderBusiman = decodeURI(decodeURI(getCookie('_A_P_userId'))) || '';
            if(orderBusiman){
                this.setState({
                    rowData:{
                        orderBusiman: decodeURI(decodeURI(getCookie('_A_P_userId')))
                    },
                    refKeyArrayorderBusiman: orderBusiman ? orderBusiman.split(','):[],
                })
            }
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
            let numArray = [
                "orderGoodsCount",
                "orderAmount",
            ];
            for(let i=0,len=numArray.length; i<len; i++ ) {
                values[numArray[i]] = Number(values[numArray[i]]);
            }


            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,
                    refKeyArrayorderOrg,
                    refKeyArraycurrType,
                    refKeyArrayorderDept,
                    refKeyArrayorderBusiman,
                } = this.state;

                values.orderOrg = refKeyArrayorderOrg.join();
                values.currType = refKeyArraycurrType.join();
                values.orderDept = refKeyArrayorderDept.join();
                values.orderBusiman = refKeyArrayorderBusiman.join();
                values.planDate = values.planDate && values.planDate.format && values.planDate.format(format) || '';
                values.orderDate = values.orderDate.format(format);
                let saveObj = Object.assign({}, rowData, values);

                await actions.TrainOrderInfo.save(
                    saveObj,
                );
            }
        });
    }

    // 处理参照回显
    handleRefShow = (tempRowData) => {
        let rowData = {};
        if(tempRowData){

            let {
                orderOrg,orderOrgName,
                currType,currTypeName,
                orderDept,orderDeptName,
                orderBusiman,orderBusimanName,
            } = tempRowData;

            this.setState({
                refKeyArrayorderOrg: orderOrg?orderOrg.split(','):[],
                refKeyArraycurrType: currType?currType.split(','):[],
                refKeyArrayorderDept: orderDept?orderDept.split(','):[],
                refKeyArrayorderBusiman: orderBusiman?orderBusiman.split(','):[],
            })
            rowData = Object.assign({},tempRowData,
                {
                    orderOrg:orderOrgName,
                    currType:currTypeName,
                    orderDept:orderDeptName,
                    orderBusiman:orderBusimanName,
                }
            )
        }
        return rowData;
    }

    onBack = async() => {
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let titleArr = ["新增","编辑","详情"];
        return titleArr[btnFlag]||'新增';
    }


    arryDeepClone = (array)=>{
        let result = [];
        if(array){
            array.map((item)=>{
                let temp = Object.assign([],item);
                result.push(temp);
            })
        }
    }

    // 通过search_id查询数据

    render() {
        const self = this;

        let { btnFlag,appType, id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArrayorderOrg,
                    refKeyArraycurrType,
                    refKeyArrayorderDept,
                    refKeyArrayorderBusiman,
                    planDateDisabled
        } = this.state;

        console.log(refKeyArrayorderBusiman)
        let title = this.onChangeHead(btnFlag);
        let { orderType,orderDeptName,orderNo,orderGoodsCount,orderOrg,currType,orderGoods,remark,orderBusimanName,planDate,orderDept,orderAmount,orderOrgName,currTypeName,orderDate,orderBusiman,orderName,billStatusEnum } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className='TrainOrderInfo-detail'>
                <Loading
                    showBackDrop={true}
                    loadingType="line"
                    show={this.props.showLoading}
                />
                <Header title={title} back={true} backFn={this.onBack}>
                    {(btnFlag < 2) ? (
                        <div className='head-btn'>
                            <Button className='head-cancel' onClick={this.onBack}>取消</Button>
                            <Button className='head-save' onClick={this.save}>保存</Button>
                        </div>
                    ) : ''}
                </Header>
                <Row className='detail-body'>
                <Col md={4} xs={6}>
                                <Label>
                                    订单编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||true}
                                        {
                                        ...getFieldProps('orderNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: orderNo || '',
                                            rules: [{
                                                message: '请输入订单编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('orderNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    请购单位：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '请购单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition1',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayorderOrg,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id);
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayorderOrg: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'orderOrg',//校验字段
                                        verVal:orderOrg
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('orderOrg')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单类型：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('orderType', {
                                            initialValue: btnFlag == 0 ? "1" : typeof orderType === 'undefined' ? "" : orderType ,
                                            rules: [{
                                                required: false, message: '请选择订单类型',
                                            }],
                                        }
                                        )}
                                        onSelect={(value)=>{
                                            if(btnFlag !== 1) return;
                                            if(value === "2"){
                                                this.setState({
                                                    planDateDisabled: false
                                                });
                                            }else{
                                                this.setState({
                                                    planDateDisabled: true
                                                });
                                            }
                                        }}   
                                    >
                                        <Option value="">请选择</Option>
                                            <Option value={ '1' }>日常采购</Option>
                                            <Option value={ '2' }>计划采购</Option>
                                            <Option value={ '3' }>合同采购</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('orderType')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单名称：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('orderName', {
                                            validateTrigger: 'onBlur',
                                            initialValue: orderName || '',
                                            rules: [{
                                                type:'string',required: false,pattern:/\S+/ig, message: '请输入订单名称',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('orderName')}
                                </span>
                            </Col>
 

                            <Col md={4} xs={6}>
                                <Label>
                                    商品：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('orderGoods', {
                                            validateTrigger: 'onBlur',
                                            initialValue: orderGoods || '',
                                            rules: [{
                                                type:'string',required: false,pattern:/\S+/ig, message: '请输入商品',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('orderGoods')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    商品数量：
                                </Label>

                                    <InputNumber
                                        iconStyle="one"
                                        min={0}
                                        step ={1}
                                        className={"input-number-int"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('orderGoodsCount', {
                                                    initialValue: typeof orderGoodsCount !== 'undefined' && orderGoodsCount || 0,
                                                    rules: [
                                                        {pattern : /^[0-9]+$/},
                                                        {required: false},
                                                    ],
                                            })
                                        }
                                    />

                                <span className='error'>
                                    {getFieldError('orderGoodsCount')}
                                </span>
                            </Col>
 
                            <Col md={4} xs={6}>
                                <Label>
                                    币种：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '币种',
                                        refType: 2,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'currency_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '2',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArraycurrType,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraycurrType: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'currType',//校验字段
                                        verVal:currType
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('currType')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单金额：
                                </Label>


                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        className={"input-number"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('orderAmount', {
                                                    initialValue: typeof orderAmount !== 'undefined' && Number(orderAmount).toFixed(2) || 0.00,
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                <span className='error'>
                                    {getFieldError('orderAmount')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    采购计划日期：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2 || btnFlag == 0 || planDateDisabled}
                                    format={format}
                                    {
                                    ...getFieldProps('planDate', {
                                        initialValue: planDate? moment(planDate): '',
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: false, message: '请选择采购计划日期',
                                        }],
                                        onChange:function(value){
                                            self.setState({
                                                rowData:{
                                                    ...rowData,
                                                    planDate: value
                                                }
                                            })
                                        }
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('planDate')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    请购部门：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '请购部门',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'newdept1',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayorderDept,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayorderDept: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'orderDept',//校验字段
                                        verVal:orderDept
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('orderDept')}
                                </span>
                            </Col>

                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    请购时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2 || btnFlag == 0}
                                    format={format}
                                    {
                                    ...getFieldProps('orderDate', {
                                        initialValue: orderDate? moment(orderDate):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: false, message: '请选择请购时间',
                                        }],
                                        onChange:function(value){
                                            self.setState({
                                                rowData:{
                                                    ...rowData,
                                                    orderDate: value
                                                }
                                            })
                                        }
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('orderDate')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    请购业务员：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '请购业务员',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_user_table',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '5',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayorderBusiman,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayorderBusiman: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'orderBusiman',//校验字段
                                        verVal:orderBusiman
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('orderBusiman')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                    <Label>订单状态</Label>
                                    <Select
                                        disabled={true}
                                        {
                                            ...getFieldProps('billStatusEnum', {
                                                validateTrigger: 'onBlur',
                                                initialValue: billStatusEnum || '0',
                                            })
                                        }
                                    >
                                            <Option value=""></Option>
                                            <Option value={ '1' }>待确认</Option>
                                            <Option value={ '2' }>已确认</Option>
                                    </Select>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    备注信息：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('remark', {
                                            validateTrigger: 'onBlur',
                                            initialValue: remark || '',
                                            rules: [{
                                                type:'string',required: false,pattern:/\S+/ig, message: '请输入备注信息',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('remark')}
                                </span>
                            </Col>
                </Row>


            </div>
        )
    }
}

export default Form.createForm()(Edit);
