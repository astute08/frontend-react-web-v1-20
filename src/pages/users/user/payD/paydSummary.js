import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './css/paydSummary.css'
import { Row, Col, Tooltip, Progress, Badge } from 'antd';
import GetLang from '../../../../includes/language';
import { Doughnut } from "react-chartjs-2";
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default (props) => {

    console.log('Summary props+++ ', props) 


    const formatNumber = props.formatNumber;
    const paydSummary = _.get(props, 'paydSummary.class');
    const capacity = _.get(props, 'paydSummary.capacity');
    const actual = _.get(props, 'paydSummary.actual');
    const memClassAmount = _.get(props, 'paydSummary.memClassAmount');
    const withdraw = _.get(props, 'paydSummary.withdraw');
    const available = _.get(props, 'paydSummary.available');
    const limit = _.get(props, 'paydSummary.limit');
    const needDominantBaselineFix = true;
    const [perWithdraw, setPerWithdraw] = useState(0);
    const [perLimit, setPerLimit] = useState(0);
    const [perAvailable, setPerAvailable] = useState(0);
    const [resultPayD, setResultPayD] = useState();

    // console.log('resultPayD+++ ', resultPayD)
    // เรียกใช้ภาษา
    const labelShow = props.labelShow;

    console.log('memClassAmount+++ ', memClassAmount);
    console.log('available+++::: ', available);
    console.log('withdraw+++::: ', withdraw);

    useEffect(() => {
        percent();
    }, [props])


    const percent = () => {
        const perAvailable = (parseInt(available) / parseInt(memClassAmount)) * 100;
        const perWithdraw = (parseInt(withdraw) / parseInt(memClassAmount)) * 100;
        // const result = 100 - (perLimit + perWithdraw);
        console.log('perAvailable+++ ', perAvailable);
        console.log('perWithdraw+++ ', perWithdraw);
        // setResultPayD(result);
        setPerAvailable(perAvailable);
        setPerWithdraw(perWithdraw);
    } 

    const options = {
      legend: {
        display: true,
        position: "bottom",
      },
      cutoutPercentage: 70,
      elements: {
        arc: {
          borderWidth: 0,
        }
      }
    };

    const data = {
      maintainAspectRatio: false,
      responsive: false,
      labels: ["a", "b", "c"],
      datasets: [
        {
          data: [perLimit, perWithdraw, resultPayD],
          backgroundColor: ["#FE6202", "#FFD7B5"],
        }
      ]
    };

    const text = (
        <div> 
            <tspan>Available to withdraw</tspan> withdraw
        </div>
    );

    return (
        <div className="div-content">
            <Row className="row-content">
                <Col span={8} className="col-content">
                    <p>{labelShow.PayDClassification ? labelShow.PayDClassification : "PayD Classification"}</p>
                    <p className="font-p">{paydSummary ? paydSummary : '-'}</p>
                </Col>
                <Col span={8} className="col-content">
                    <p>{labelShow.lCapacity ? labelShow.lCapacity : "Capacity"}</p>
                    <p className="font-p">{`${capacity || '0'}`}</p>
                </Col>
                <Col span={8} className="col-content">
                    <p>{labelShow.lActual ? labelShow.lActual : "Actual"}</p>
                    <p className="font-p">{`${actual || '0'}`}</p>
                </Col>
            </Row>
            <div>
                <Row className="row-graph">
                    <Col span={5} className="col-graph">
                        <CircularProgressbarWithChildren className="progressbar"
                            value={`${perAvailable || 0}`}
                            text={
                                <tspan dy={needDominantBaselineFix ? -7 : 0}>{labelShow.Availabletowithdraw ? labelShow.Availabletowithdraw : "Available to withdraw"}</tspan>
                            }
                            dy={needDominantBaselineFix ? -30 : 0}
                            strokeWidth={14}
                            styles={buildStyles({
                            pathColor: "#FFD7B5",
                            trailColor: "#eee",
                            textColor: "#000",
                            fontSize: "14px",
                            })}
                        >
                            <CircularProgressbar
                                value={`${perWithdraw || 0}`}
                                text={
                                    <tspan style={{ fontSize: '14px' }} dy={needDominantBaselineFix ? 10 : 0}>{formatNumber(`${available || 0}฿`)}</tspan>
                                }
                                dy={needDominantBaselineFix ? -30 : 0}
                                strokeWidth={14}
                                styles={buildStyles({
                                    pathColor: "#FE6202",
                                    trailColor: "transparent",
                                    textColor: "#000",
                                    fontSize: "14px",
                                })}
                            />
                        </CircularProgressbarWithChildren>
                    </Col>
                    <Col span={12} className="col-graph-details">

                        <div className="col-graph-details-div">
                            <Row className="row-details-Distance" >
                                <Col span={8}>
                                    <Badge className="badge-size" color="#E7E7E7" text={labelShow.lOverall ? labelShow.lOverall : "Overall"} />
                                </Col>
                                <Col span={16}>
                                    <p>{`${memClassAmount ? formatNumber(memClassAmount) : '0'} ${labelShow.lBaht ? labelShow.lBaht : "Baht"}`}</p>
                                </Col>
                            </Row>
                            <Row className="row-details-Distance">
                                <Col span={8}>
                                    <Badge className="badge-size" color="#FE6202" text={labelShow.lWithdraw ? labelShow.lWithdraw : "Withdraw"} />
                                </Col>
                                <Col span={16}>
                                    <p>{`${withdraw ? formatNumber(withdraw) : '0'} ${labelShow.lBaht ? labelShow.lBaht : "Baht"}`}</p>
                                </Col>
                            </Row>
                            <Row className="row-details-Distance">
                                <Col span={8}>
                                    <Badge className="badge-size" color="#FFD7B5" text={labelShow.lAvailable ? labelShow.lAvailable : "Available"} />
                                </Col>
                                <Col span={16}>
                                    <p>{`${available ? formatNumber(available) : '0'} ${labelShow.lBaht ? labelShow.lBaht : "Baht"}`}</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}