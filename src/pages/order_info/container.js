import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import TrainOrderInfoTable from './components/TrainOrderInfo-root/TrainOrderInfoTable';
import TrainOrderInfoSelectTable from './components/TrainOrderInfo-root/TrainOrderInfoSelectTable';
import TrainOrderInfoPaginationTable from './components/TrainOrderInfo-root/TrainOrderInfoPaginationTable';
import TrainOrderInfoEdit from './components/TrainOrderInfo-edit/Edit';
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedTrainOrderInfoTable = connect( state => state.TrainOrderInfo, null )(TrainOrderInfoTable);
export const ConnectedTrainOrderInfoSelectTable = connect( state => state.TrainOrderInfo, null )(TrainOrderInfoSelectTable);
export const ConnectedTrainOrderInfoPaginationTable = connect( state => state.TrainOrderInfo, null )(TrainOrderInfoPaginationTable);
export const ConnectedTrainOrderInfoEdit = connect( state => state.TrainOrderInfo, null )(TrainOrderInfoEdit);
