import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import Arrive_orderTable from './components/arrive_order-root/Arrive_orderTable';
import Arrive_orderSelectTable from './components/arrive_order-root/Arrive_orderSelectTable';
import Arrive_orderPaginationTable from './components/arrive_order-root/Arrive_orderPaginationTable';
import Arrive_orderEdit from './components/arrive_order-edit/Edit';
import Arrive_orderBpmChart from './components/arrive_order-bpm-chart'
    import MaterialChildtable from './components/material-childtable'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedArrive_orderTable = connect( state => state.arrive_order, null )(Arrive_orderTable);
export const ConnectedArrive_orderSelectTable = connect( state => state.arrive_order, null )(Arrive_orderSelectTable);
export const ConnectedArrive_orderPaginationTable = connect( state => state.arrive_order, null )(Arrive_orderPaginationTable);
export const ConnectedArrive_orderEdit = connect( state => state.arrive_order, null )(Arrive_orderEdit);
export const ConnectedArrive_orderBpmChart = connect( state => state.arrive_order, null )(Arrive_orderBpmChart);
    export const ConnectedMaterialChildtable  = connect( state => state.arrive_order, null )(MaterialChildtable);
