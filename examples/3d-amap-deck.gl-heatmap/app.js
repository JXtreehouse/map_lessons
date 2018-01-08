/* global window,document */
import React,{Component} from 'react';
import {render} from 'react-dom';
import {Map} from 'react-amap';
import DeckGLOverlay from './deckgl-overlay.js';

import {csv as requestCsv} from 'd3-request';

const YOUR_AMAP_KEY = '8c8c021990b332b22254f2f8289a62ef';

const DATA_URL =
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line
// const DATA_URL = 'http://osgp88fat.bkt.clouddn.com/data/lng-lat.csv';

class Root extends Component {
    constructor (props) {
        super(props);
        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width:500,
                height:500
            },
            data:null
        };
        this.mapCenter = { longitude: -0.2 , latitude: 51.5},
        this.viewMode = "3D",
        this.resizeEnable = true,

        requestCsv(DATA_URL, (error, response) => {
            if (!error) {
                const data = response.map(d => [Number(d.lng), Number(d.lat)]);
                this.setState({data});
            }
        });



    }

    componentDidMount() {
      window.addEventListener('resize', this._resize.bind(this));
      this._resize();
    }

    _resize() {
      this._onViewportChange({
          width: window.innerWidth,
          height:window.innerHeight
      });
    }

    _onViewportChange(viewport) {
       this.setState({
           viewport: {...this.state.viewport, ...viewport}
       });
    }

    render() {
        const {viewport, data} = this.state;

        return (
        <Map
            {...viewport}
             amapkey={YOUR_AMAP_KEY}
             onViewportChange={this._onViewportChange.bind(this)}
            center = {this.mapCenter} zoom={7} viewMode={this.viewMode}
            resizeEnable={this.resizeEnable}
        >

            <DeckGLOverlay viewport={viewport} data={data || []} />

        </Map>

        );
    }
}

render(<Root />, document.getElementById('root'));
