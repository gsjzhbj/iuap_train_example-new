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

class Arrive_orderForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            note: '',
            total: '',
            receiver: '',
            refKeyArrayorg:"",
            supplier: '',
            receive_time: '',
            billcode: '',
            isback: '',
            pk_org: '',
        }
    }
    componentWillMount(){
        // 获得到货单列表数据
        actions.arrive_order.getOrderTypes();
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
                refKeyArrayorg,
            } = this.state;
            let total = values.total;
            if(total){
                if(Number(total)>0){
                values.total = Number(total);
                }else {
                delete values.total
                }
            }
            if(refKeyArrayorg){
                values.org = refKeyArrayorg
            }else {
                values.org = "";
            }
            await actions.arrive_order.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            note:'',
            total:'',
            receiver:'',
            refKeyArrayorg:'',
            org:'',
            supplier:'',
            receive_time:'',
            billcode:'',
            isback:'',
            pk_org:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArrayorg,
        } = this.state;
        return (
            <SearchPanel
                    className='arrive_order-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>单据号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('billcode', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>库存组织</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('pk_org', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(Arrive_orderForm)