import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import TrainOrderInfoTable from '../TrainOrderInfo-table';
import TrainOrderInfoForm from '../TrainOrderInfo-form';

import './index.less';

/**
 * TrainOrderInfoRoot Component
 */
class TrainOrderInfoRoot  extends Component {
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
        actions.TrainOrderInfo.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='TrainOrderInfo-root'>
                <Header title='培训请购单' back={true}/>
                <TrainOrderInfoForm { ...this.props }/>
                <TrainOrderInfoTable { ...this.props }/>
            </div>
        )
    }
}
export default TrainOrderInfoRoot;