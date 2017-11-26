import Vue from 'vue';

import editor from './components/editor';


let instance = null;


export default function (e, win) {

    console.log(e)
    if (e.type === 'init') {
        if (instance) {
            instance.$destroy();
        }
        instance = new Vue({
            el: '#app',
            render(h) {
                const self = this;
                return h('div', {
                    attrs: {
                        id: 'app',
                        style: "height:500px"
                    }
                }, [
                    h(editor, {
                        props: {
                            jsonData: e.data,
                        },
                        on: {
                            upVal(val) {
                                //  
                                win.postMessage({
                                    type: 'devtool-data-update',
                                    data: val
                                }, '*');
                            }
                        }
                    })
                ]);
            },
            component: {
                editor
            }
        });
    }
}