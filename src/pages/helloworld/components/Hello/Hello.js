import React, { Component } from 'react';
import Form from 'bee-form';
import RefWithInput from 'yyuap-ref/dist2/refWithInput';
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            refKeyArraypurOrg:[]
        };
    }

    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let {refKeyArraypurOrg} = this.state;
                values.purOrg = refKeyArraypurOrg.join();
                actions.OrderInfo.save(values);
            }
        });
    }
    onBack = async() => {
        window.history.go(-1);
    }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div>
                <Header title={title} back={true} backFn={this.onBack}>
                    {(btnFlag < 2) ? (
                        <div className='head-btn'>
                            <Button className='head-cancel' onClick={this.onBack}>取消</Button>
                            <Button className='head-save' onClick={this.save}>保存</Button>
                        </div>
                    ) : ''}
                </Header>
                <Col md={4} xs={6}>
                    <Label>
                        采购单位：
                            </Label>
                    <RefWithInput disabled={btnFlag == 2} option={Object.assign(JSON.parse(options), {
                        title: '',
                        refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                        className: '',
                        param: {//url请求参数
                            refCode: 'common_ref',
                            tenantId: '',
                            sysId: '',
                            // transmitParam: '',
                        },
                        keyList: refKeyArraypurOrg||[],//选中的key
                        onSave: function (sels) {
                            console.log(sels);
                            var temp = sels.map(v => v.key)
                            console.log("temp", temp);
                            self.setState({
                                refKeyArraypurOrg: temp,
                            })
                        },
                        showKey: 'peoname',
                        verification: true,//是否进行校验
                        verKey: 'purOrg',//校验字段
                        verVal: purOrg
                    })} form={this.props.form} />

                    <span className='error'>
                        {getFieldError('purOrg')}
                    </span>
                </Col>
            </div>
        );
    }
}

export default Form.createForm()(App);