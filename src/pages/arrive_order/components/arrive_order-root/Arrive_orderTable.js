import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import Arrive_orderTable from '../arrive_order-table';
import Arrive_orderForm from '../arrive_order-form';

import './index.less';

/**
 * Arrive_orderRoot Component
 */
class Arrive_orderRoot  extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    /**
     *
     */
    componentWillMount() {
        this.getTableData();
    }
    /**
     * 获取table表格数据
     */
    getTableData = () => {
        actions.arrive_order.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='arrive_order-root'>
                <Header title='到货单' back={true}/>
                <Arrive_orderForm { ...this.props }/>
                <Arrive_orderTable { ...this.props }/>
            </div>
        )
    }
}
export default Arrive_orderRoot;