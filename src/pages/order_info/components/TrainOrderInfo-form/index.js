import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Switch, InputNumber, Col, Row,FormControl, Label, Select } from "tinper-bee";
import Form from 'bee-form';
import Radio from 'bee-radio';
import DatePicker from 'bee-datepicker';
import 'bee-datepicker/build/DatePicker.css';
import SearchPanel from 'components/SearchPanel';
const FormItem = Form.FormItem;
import options from "components/RefOption";
const { RangePicker } = DatePicker;
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './index.less'

class TrainOrderInfoForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            orderType: '',
            orderDeptName: '',
            orderNo: '',
            orderGoodsCount: '',
            refKeyArrayorderOrg:"",
            refKeyArraycurrType:"",
            orderGoods: '',
            remark: '',
            orderBusimanName: '',
            planDate: '',
            refKeyArrayorderDept:"",
            orderAmount: '',
            orderOrgName: '',
            currTypeName: '',
            orderDate: '',
            refKeyArrayorderBusiman:"",
            orderName: '',
        }
    }
    componentWillMount(){
        // 获得培训请购单列表数据
        actions.TrainOrderInfo.getOrderTypes();
    }
    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error,values) => {
        this.props.form.validateFields(async (err, values) => {
            values.pageIndex = this.props.pageIndex || 0;
            values.pageSize = this.props.pageSize || 10;
            let {
                refKeyArrayorderOrg,
                refKeyArraycurrType,
                refKeyArrayorderDept,
                refKeyArrayorderBusiman,
            } = this.state;
            if(refKeyArrayorderOrg){
                values.orderOrg = refKeyArrayorderOrg
            }else {
                values.orderOrg = "";
            }
            if(refKeyArraycurrType){
                values.currType = refKeyArraycurrType
            }else {
                values.currType = "";
            }
            if(refKeyArrayorderDept){
                values.orderDept = refKeyArrayorderDept
            }else {
                values.orderDept = "";
            }
            let orderAmount = values.orderAmount;
            if(orderAmount){
                if(Number(orderAmount)>0){
                values.orderAmount = Number(orderAmount);
                }else {
                delete values.orderAmount
                }
            }
            if(refKeyArrayorderBusiman){
                values.orderBusiman = refKeyArrayorderBusiman
            }else {
                values.orderBusiman = "";
            }
            await actions.TrainOrderInfo.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            orderType:'',
            orderDeptName:'',
            orderNo:'',
            orderGoodsCount:'',
            refKeyArrayorderOrg:'',
            orderOrg:'',
            refKeyArraycurrType:'',
            currType:'',
            orderGoods:'',
            remark:'',
            orderBusimanName:'',
            planDate:'',
            refKeyArrayorderDept:'',
            orderDept:'',
            orderAmount:'',
            orderOrgName:'',
            currTypeName:'',
            orderDate:'',
            refKeyArrayorderBusiman:'',
            orderBusiman:'',
            orderName:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArrayorderOrg,
            refKeyArraycurrType,
            refKeyArrayorderDept,
            refKeyArrayorderBusiman,
        } = this.state;
        return (
            <SearchPanel
                    className='TrainOrderInfo-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单类型</Label>

                                    <Select
                                            {
                                            ...getFieldProps('orderType', {
                                            initialValue: '',
                                        })
                                    }
                                    >
                                            <Option value="">请选择</Option>
                                              <Option value={ '1' }>日常采购</Option>
                                              <Option value={ '2' }>计划采购</Option>
                                              <Option value={ '3' }>合同采购</Option>
                                    </Select>

                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单编号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('orderNo', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>请购单位</Label>


                                    <RefWithInput option={options({
                                                  title: '请购单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition1',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                        },
                                        keyList:(refKeyArrayorderOrg && refKeyArrayorderOrg.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayorderOrg: temp.join(),
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'orderOrg',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>币种</Label>


                                    <RefWithInput option={options({
                                                  title: '币种',
                                        refType: 2,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'currency_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '2',
                                        },
                                        keyList:(refKeyArraycurrType && refKeyArraycurrType.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraycurrType: temp.join(),
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'currType',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>商品</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('orderGoods', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>请购部门</Label>


                                    <RefWithInput option={options({
                                                  title: '请购部门',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'newdept1',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                        },
                                        keyList:(refKeyArrayorderDept && refKeyArrayorderDept.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayorderDept: temp.join(),
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'orderDept',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单金额</Label>

                                    <InputNumber
                                            precision={2}
                                            min={0}
                                            className={"input-number"}
                                            {
                                            ...getFieldProps('orderAmount', {
                                                    initialValue: '0.00',
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />

                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>请购时间</Label>


                                    <RangePicker
                                            defaultValue={this.state.orderDate}
                                            placeholder={'开始 ~ 结束'}
                                    dateInputPlaceholder={['开始', '结束']}
                                    {
                                        ...getFieldProps('orderDate', {
                                            initialValue:'',
                                            onChange:  (v)=> {
                                                this.setState({
                                        orderDate: v
                                                })
                                            }
                                        })
                                    }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单名称</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('orderName', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单状态</Label>
                                    <Select
                                            {
                                            ...getFieldProps('billstatus', {
                                            initialValue: '',
                                        })
                                    }
                                    >
                                            <Option value="">请选择</Option>
                                              <Option value={ '0' }>待确认</Option>
                                              <Option value={ '1' }>已确认</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(TrainOrderInfoForm)