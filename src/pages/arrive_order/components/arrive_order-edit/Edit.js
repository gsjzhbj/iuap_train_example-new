import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
import { Switch, InputNumber, Loading, Table, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message } from "tinper-bee";
import Radio from 'bee-radio';
import { BpmTaskApprovalWrap } from 'yyuap-bpm';
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
import ChildTablematerial from '../material-childtable';
import { setCookie, getCookie } from "utils";

const FormItem = Form.FormItem;
const Option = Select.Option;
const format = "YYYY-MM-DD HH:mm:ss";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
            refKeyArrayorg: [],
            fileNameData: props.rowData.attachment || [],//上传附件数据
        }
    }
    async componentWillMount() {
        await actions.arrive_order.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.arrive_order.queryDetail({ search_id });
            let rowData = this.handleRefShow(tempRowData) || {};

            console.log('rowData', rowData);
            this.setState({
                rowData: rowData,
            })
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
            let numArray = [
                "total",
            ];
            for (let i = 0, len = numArray.length; i < len; i++) {
                values[numArray[i]] = Number(values[numArray[i]]);
            }


            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let { rowData,
                    refKeyArrayorg,
                } = this.state;

                values.org = refKeyArrayorg.join();
                values.receive_time = values.receive_time.format(format);
                let saveObj = Object.assign({}, rowData, values);
                let { childListmaterial, cacheArraymaterial, delArraymaterial } = this.props;
                // 编辑保存但是未修改参照,修改参照字段为参照id数组
                if (childListmaterial) {
                    childListmaterial.map((item, index) => {
                        // 判断参照值是否有改动
                        let uuid = item.uuid,
                            refArray = [
                            ],
                            tempRefIdName = [
                            ],
                            target = cacheArraymaterial.filter(item => item.uuid == uuid)[0];
                        // 处理单行多个参照
                        for (let i = 0, len = refArray.length; i < len; i++) {
                            let tempRef = item[refArray[i] + uuid],
                                tempShowName = item[tempRefIdName[i]];

                            if (tempRef) {

                                // 参照有改动
                                item[refArray[i]] = tempRef;
                            } else if (tempShowName) {

                                // 参照无改动
                                item[refArray[i]] = target[refArray[i]];
                            }
                        }


                    })
                }
                console.log('save childList', childListmaterial)
                console.log('save delArray', delArraymaterial);
                // 添加删除的数组，删除的数组中dr项的值都为1
                let resultArray = childListmaterial.concat(delArraymaterial);
                saveObj.total = 0;
                childListmaterial.forEach(item => {
                    saveObj.total +=  (Number(item.number) || 0);
                });
                let commitData = {
                    entity: saveObj,
                    sublist: {
                        materialList: resultArray,
                    }
                };
                console.log("save values", JSON.stringify(commitData));


                await actions.arrive_order.save(
                    commitData,
                );
                // 置空缓存数据和删除数组
                await actions.arrive_order.updateState({
                    cacheArraymaterial: [],
                    delArraymaterial: [],
                })
            }
        });
    }

    // 处理参照回显
    handleRefShow = (tempRowData) => {
        let rowData = {};
        if (tempRowData) {

            let {
                org, pk_org,
            } = tempRowData;

            this.setState({
                refKeyArrayorg: org ? org.split(',') : [],
            })
            rowData = Object.assign({}, tempRowData,
                {
                    org: pk_org,
                }
            )
        }
        return rowData;
    }

    onBack = async () => {
        await actions.arrive_order.updateState({
            childListmaterial: [],
            cacheArramaterial: [],
            delArraymaterial: [],
        })
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let titleArr = ["新增", "编辑", "详情"];
        return titleArr[btnFlag] || '新增';
    }

    // 跳转到流程图
    onClickToBPM = (rowData) => {
        console.log("actions", actions);
        actions.routing.push({
            pathname: 'arrive_order-chart',
            search: `?id=${rowData.id}`
        })
    }

    // 流程图相关回调函数
    onBpmStart = () => {
        actions.arrive_order.updateState({ showLoading: true });
    }
    onBpmEnd = () => {
        actions.arrive_order.updateState({ showLoading: false });
    }
    onBpmSuccess = () => {
        window.setTimeout(() => {
            actions.arrive_order.updateState({ showLoading: false });
            // actions.routing.push('pagination-table');
            actions.routing.goBack();
        }, 1000);
    }
    onBpmError = () => {
        actions.arrive_order.updateState({ showLoading: false });
    }

    // 审批面板展示
    showBpmComponent = (btnFlag, appType, id, processDefinitionId, processInstanceId, rowData) => {
        // btnFlag为2表示为详情
        if ((btnFlag == 2) && rowData && rowData['id']) {
            console.log("showBpmComponent", btnFlag)
            return (
                <div >
                    {appType == 1 && <BpmTaskApprovalWrap
                        id={rowData.id}
                        onBpmFlowClick={() => { this.onClickToBPM(rowData) }}
                        appType={appType}
                        onStart={this.onBpmStart}
                        onEnd={this.onBpmEnd}
                        onSuccess={this.onBpmSuccess}
                        onError={this.onBpmError}
                    />}
                    {appType == 2 && <BpmTaskApprovalWrap
                        id={id}
                        processDefinitionId={processDefinitionId}
                        processInstanceId={processInstanceId}
                        onBpmFlowClick={() => { this.onClickToBPM(rowData) }}
                        appType={appType}
                        onStart={this.onBpmStart}
                        onEnd={this.onBpmEnd}
                        onSuccess={this.onBpmSuccess}
                        onError={this.onBpmError}
                    />}
                </div>

            );
        }
    }

    arryDeepClone = (array) => {
        let result = [];
        if (array) {
            array.map((item) => {
                let temp = Object.assign([], item);
                result.push(temp);
            })
        }
    }

    // 通过search_id查询数据

    render() {
        const self = this;

        let { btnFlag, appType, id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let { rowData,
            refKeyArrayorg,
        } = this.state;

        let {
            cacheArraymaterial,
            delArraymaterial,
            childListmaterial,
        } = this.props;

        let childObj = {
            cacheArraymaterial,
            delArraymaterial,
            childListmaterial,
        }

        let title = this.onChangeHead(btnFlag);
        let { note, receiver, org, supplier, receive_time, billcode, isback, pk_org, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;
        let total = 0;
        childListmaterial.forEach(item=>{
            total += (Number(item.number) || 0);
        });
        return (
            <div className='arrive_order-detail'>
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
                {
                    self.showBpmComponent(btnFlag, appType ? appType : "1", id, processDefinitionId, processInstanceId, rowData)
                }
                <Row className='detail-body'>
                    <Col md={4} xs={6}>
                        <Label>
                            单据号：
                                </Label>
                        <FormControl disabled={btnFlag == 2 || false}
                            {
                            ...getFieldProps('billcode', {
                                validateTrigger: 'onBlur',
                                initialValue: billcode || '',
                                rules: [{
                                    type: 'string', required: false, pattern: /\S+/ig, message: '请输入单据号',
                                }],
                            }
                            )}
                        />


                        <span className='error'>
                            {getFieldError('billcode')}
                        </span>
                    </Col>
                    <Col md={4} xs={6}>
                        <Label>
                            库存组织：
                                </Label>
                        <RefWithInput disabled={btnFlag == 2} option={options({
                            title: '库存组织',
                            refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                            className: '',
                            param: {//url请求参数
                                refCode: 'newdept',
                                tenantId: '',
                                sysId: '',
                                transmitParam: '1',
                                locale: getCookie('u_locale'),
                            },

                            keyList: refKeyArrayorg,//选中的key
                            onSave: function (sels) {
                                console.log(sels);
                                var temp = sels.map(v => v.id)
                                console.log("temp", temp);
                                self.setState({
                                    refKeyArrayorg: temp,
                                })
                            },
                            showKey: 'refname',
                            verification: true,//是否进行校验
                            verKey: 'org',//校验字段
                            verVal: org
                        })} form={this.props.form} />


                        <span className='error'>
                            {getFieldError('org')}
                        </span>
                    </Col>
                    <Col md={4} xs={6}>
                        <Label>
                            供应商：
                                </Label>
                        <FormControl disabled={btnFlag == 2 || false}
                            {
                            ...getFieldProps('supplier', {
                                validateTrigger: 'onBlur',
                                initialValue: supplier || '',
                                rules: [{
                                    type: 'string', required: false, pattern: /\S+/ig, message: '请输入供应商',
                                }],
                            }
                            )}
                        />


                        <span className='error'>
                            {getFieldError('supplier')}
                        </span>
                    </Col>
                    <Col md={4} xs={6}>
                        <Label>
                            收货人：
                                </Label>
                        <FormControl disabled={btnFlag == 2 || false}
                            {
                            ...getFieldProps('receiver', {
                                validateTrigger: 'onBlur',
                                initialValue: receiver || '',
                                rules: [{
                                    type: 'string', required: false, pattern: /\S+/ig, message: '请输入收货人',
                                }],
                            }
                            )}
                        />


                        <span className='error'>
                            {getFieldError('receiver')}
                        </span>
                    </Col>
                    <Col md={4} xs={6}>
                        <Label class="datepicker">
                            到货时间：
                                </Label>
                        <DatePicker className='form-item' disabled={btnFlag == 2}
                            format={format}
                            {
                            ...getFieldProps('receive_time', {
                                initialValue: receive_time ? moment(receive_time) : moment(),
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: false, message: '请选择到货时间',
                                }],
                                onChange: function (value) {
                                    self.setState({
                                        rowData: {
                                            ...rowData,
                                            receive_time: value
                                        }
                                    })
                                }
                            }
                            )}
                        />


                        <span className='error'>
                            {getFieldError('receive_time')}
                        </span>
                    </Col>
                    <Col md={4} xs={6}>
                        <Label>
                            退货：
                                </Label>

                        {
                            (btnFlag < 2) ?
                                (<Radio.RadioGroup
                                    disabled={true}
                                    selectedValue={isback || ''}
                                    {
                                    ...getFieldProps('isback', {
                                        initialValue: isback || '',
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: false, message: '请选择退货',
                                        }],
                                        onChange(value) {
                                            let tempRow = Object.assign({}, rowData, { isback: value });
                                            self.setState({
                                                rowData: tempRow
                                            })
                                        },
                                    }
                                    )}
                                >
                                    <Radio value={"true"}>是</Radio>
                                    <Radio value={"false"}>否</Radio>
                                </Radio.RadioGroup>) : (
                                    <FormControl disabled={btnFlag == 2} value={isback} />
                                )
                        }


                        <span className='error'>
                            {getFieldError('isback')}
                        </span>
                    </Col>



                    <Col md={4} xs={6}>
                        <Label>
                            备注：
                                </Label>
                        <FormControl disabled={btnFlag == 2 || false}
                            {
                            ...getFieldProps('note', {
                                validateTrigger: 'onBlur',
                                initialValue: note || '',
                                rules: [{
                                    type: 'string', required: false, pattern: /\S+/ig, message: '请输入备注',
                                }],
                            }
                            )}
                        />


                        <span className='error'>
                            {getFieldError('note')}
                        </span>
                    </Col>
                    <Col md={4} xs={6}>
                        <Label>
                            数量：
                                </Label>
                        {total || 0}

                    </Col>




                </Row>

                <div className="master-tag">
                    <div className="childhead">
                        <span className="workbreakdown" >物料</span>
                    </div>
                </div>
                <ChildTablematerial btnFlag={btnFlag} {...childObj} />

            </div>
        )
    }
}

export default Form.createForm()(Edit);
