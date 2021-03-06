import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {formatType, lighten} from '../common'
import { ComparisonDataPoint } from './ComparisonDataPoint'

const DataPointsWrapper = styled.div`
  font-family: "Open Sans", "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: ${props => props.layout === 'horizontal' ? 'row' : 'column'};
  align-items: center;
  margin: 10px;
  height: 100%;
`

const dataPointGroupDirectionDict = {
  'below': 'column',
  'above': 'column-reverse',
  'left': 'row-reverse',
  'right': 'row'
}

const DataPointGroup = styled.div`
  margin: 20px 5px;
  text-align: center;
  width: 100%;
  display: flex;
  flex-shrink: ${props => props.layout === 'horizontal' ? 'auto' : 0 };
  flex-direction: 'column';
  align-items: center;
  justify-content: center;
`
const Divider = styled.div`
  background-color: #282828;
  height: 35vh;
  width: 1px;
`

const DataPoint = styled.div`
  display: flex;
  flex-shrink: ${props => props.layout === 'horizontal' ? 'auto' : 0 };
  flex-direction: ${props => props.titlePlacement === 'above' ? 'column' : 'column-reverse'};
  flex: 1;
`

const DataPointTitle = styled.div`
  font-weight: 100;
  color: ${props => props.color};
  margin: 5px 0;
`

const DataPointValue = styled.div`
  font-size: 3em;
  font-weight: 100;
  color: ${props => props.color};

  a.drillable-link {
    color: ${props => props.color};
    text-decoration: none;
  }
  :hover {
    text-decoration: underline;
  }
`

class MultipleValue extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {}
    this.state.groupingLayout = 'horizontal';
    this.state.fontSize = this.calculateFontSize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.recalculateSizing);
  }

  componentDidUpdate() {
    this.recalculateSizing();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recalculateSizing);
  }

  getWindowSize = () => {
    return Math.max(window.innerWidth, window.innerHeight);
  }

  calculateFontSize = () => {
    const multiplier = this.state.groupingLayout === 'horizontal' ? 0.015 : 0.02;
    return Math.round(this.getWindowSize() * multiplier);
  }

  handleClick = (cell, event) => {
    cell.link !== undefined ? LookerCharts.Utils.openDrillMenu({
         links: cell.link,
         event: event
    }) : LookerCharts.Utils.openDrillMenu({
         links: [],
         event: event
    });
  }

  recalculateSizing = () => {
    const EM = 16;
    const groupingLayout = window.innerWidth >= 768 ? 'horizontal' : 'vertical';

    let CONFIG = this.props.config;


    var font_size = (CONFIG.font_size_main != "" ? CONFIG.font_size_main : this.calculateFontSize());
    font_size = font_size / EM;


    this.setState({
      fontSize: font_size,
      groupingLayout
    })
  }

  render() {
    const {config, data} = this.props;
    let CONFIG = this.props.config;
    let firstData = data[0]
    

    return (
      <DataPointsWrapper
        layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
        font={config['grouping_font']}
        style={{fontSize: `${this.state.fontSize}em`}}
      >
      <>
      <DataPointGroup
                    key="Grouped"
                    layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
                >
                    <DataPoint titlePlacement={config[`title_placement_${firstData.name}`]}>
                            <DataPointTitle color={config[`style_${firstData.name}`]}>
                                {config[`title_overrride_${firstData.name}`] || firstData.label}
                            </DataPointTitle>
                        <DataPointValue
                            color={config[`style_${firstData.name}`]}
                            onClick={() => { this.handleClick(firstData, event) }}
                            layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
                        >
                            {data.formattedValue}
                        </DataPointValue>
                    </DataPoint>
                   
                    {/* {data.length < 2 ? null : data.slice(1).map(item => {
                            var progressPerc = Math.round((item.value / firstData.value) * 100)
                            var percChange = progressPerc - 100 
                            console.log(item)// Whatever range condition you want
                            return <ComparisonDataPoint
                                config={config}
                                compDataPoint={item}
                                dataPoint={firstData}
                                percChange={percChange}
                                progressPerc={progressPerc}
                                handleClick={this.handleClick}
                                key = {item.name}
                            />
                            
                        
                    } */

                    data.length < 2 ? null : data.slice(1).map(item => <p> testing this </p> )
                    }
                    
                    

           
              </DataPointGroup>
        
              </>
            )
        
      </DataPointsWrapper>
    )

  }
}

MultipleValue.propTypes = {
  config: PropTypes.object,
  data: PropTypes.array,
};

export default MultipleValue;
